<template>
<!--搜素结果的公共组件-->
    <scroll class="searchlist" 
        :data="result" 
        :pullup="pullup"
        @scrollToEnd="searchMore"
        ref="searchlist">
        <ul class="search-list">
            <li class="item" 
                v-for="(item,index) in result" 
                :key="index"
                @click="selectItem(item)">
                <div class="icon">
                    <img :src="getIconCls(item)" alt="">
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>
    </scroll>
</template>
<script>
import Scroll from '../base/scroll/scroll'
import Loading from '../base/loading/loading'
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import {createSong,processSongsUrl,isValidMusic} from 'common/js/song'
import Singer from 'common/js/singer'
import {mapMutations,mapActions} from 'vuex'
const TYPE_SINGER='singer'
const perpage=20
export default {
    components:{
       Scroll,
       Loading
    },
    props:{
        query:{//检索词
            type:String,
            default:''
        },
        showSinger:{
            type:Boolean,
            default:true
        }
    },
    data(){
        return{
            page:1,
            result:[],
            pullup:true,
            hasMore:true
        }
    },
    methods:{
        ...mapActions([
            'insertSong'
        ]),
        selectItem(item){
            //判断，如果是歌手，调至歌手详情页
            if(item.type=== TYPE_SINGER){
                const singer=new Singer({
                    id:item.singermid,
                    name:item.singername
                })
                this.$router.push({
                    path:`/search/${singer.id}`
                })
                this.setSinger(singer)
            }else{
                this.insertSong(item)
            }
        },
        getIconCls(item){
            if (item.type === TYPE_SINGER) {
                return require("../assets/person.png")
            } else {
                return require("../assets/muisc.png")
            }
        },
        getDisplayName (item) {
            if (item.type === TYPE_SINGER) {
                return item.singername
            } else {
                return `${item.name}-${item.singer}`
            }
        },
        search(){//请求服务端获取数据
            this.page=1
            this.hasMore=true
            this.$refs.searchlist.scrollTo(0,0)
            //search  api/search中的方法
            search(this.query,this.page,this.showSinger,perpage).then((res)=>{
                if(res.code===ERR_OK){
                    //this.result=this. _getResult(res.data)
                    this. _getResult(res.data).then((result)=>{
                        this.result=result
                    })
                    this.checkMore(res.data)
                }
            })
        },
        //@scrollToEnd滚动到底部了，触发searchMore事件
        searchMore(){
            //搜索更多
            if(!this.hasMore){
                return
            }
            this.page++
            search(this.query,this.page,this.showSinger,perpage).then((res)=>{
                 if(res.code===ERR_OK){
                    //  this.result=this.result.concat(this. _getResult(res.data))
                    this. _getResult(res.data).then((result)=>{
                        this.result=this.result.concat(result)
                    })
                     this.checkMore(res.data)
                 }
            })
        },
        checkMore(data){
            const song=data.song
            if(song.list.lenght || (song.curnum +song.curpage*perpage) >=song.totalnum){
                this.hasMore=false
            }
        },
        _getResult(data){
            let ret=[]
            if(data.zhida && data.zhida.singerid && this.page===1){
                ret.push({...data.zhida,...{type:TYPE_SINGER}})
            }
            return processSongsUrl(this._normalizeSongs(data.song.list)).then((songs)=>{
                ret =ret.concat(songs)
                return ret
            })
           
        },
        _normalizeSongs(list){
            let ret=[]
            list.forEach((musicData)=>{
                 if (isValidMusic(musicData)) {
                    ret.push(createSong(musicData))
                }
            })
            return ret
        },
         ...mapMutations({
                setSinger:'SET_SINGER'
            })
    },
    watch:{
        query(){
            //监听搜索词的变化，调用search()方法
            this.search()
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.searchlist
    height:100%
    overflow:hidden
    .search-list
        padding:0 30px
        .item
            display:flex
            align-items:center
            padding-bottom:20px
            .icon
                flex:0 0 30px
                width:30px 
                img
                    width:20px
                    height:20px
            .name
                flex:1
                font-size:$font-size-medium
                color:$color-text-d
                overflow:hidden
                .text
                    no-wrap()  
    .no-result-wrapper
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>