<template>
<!-- 排行榜 -->
    <div class="rank" ref="rank">
        <scroll class="toplist" :data="topList" ref="toplist">
            <ul>
                <li class="item" v-for="(item,index) in topList" :key="index" @click="selectItem(item)">
                    <div class="left-img">
                        <img v-lazy="item.picUrl" alt="" class="img">
                    </div>
                    <ul class="songlist">
                        <li class="song" v-for="(list,index) in item.songList" :key="index">
                            <span>{{index+1}}</span>
                            <span>{{list.songname}}——{{list.singername}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="loading-container" v-show="!topList.length">
                <loading></loading>
            </div>
        </scroll>
        <router-view/>
    </div>
</template>
<script>
import { getTopList } from 'api/rank'
import Scroll from '../base/scroll/scroll'
import Loading from '../base/loading/loading'
import { ERR_OK } from 'api/config'
import { playlistMixin } from 'common/js/mixin'
import {mapMutations} from'vuex'
export default{
    mixins:[playlistMixin],
    components:{
        Scroll,
        Loading
    },
    data(){
        return{
            topList:[]
        }
    },
    created(){
        this._getTopList()
    },
    methods:{
         ...mapMutations({
            setTopList: 'SET_TOP_LIST'
        }),
        selectItem(item){
            this.$router.push({
                path:`/rank/${item.id}`
            })
            this.setTopList(item)
        },
        handlePlaylist(playlist){
            const bottom =playlist.length>0 ?"60px":""
            this.$refs.rank.style.bottom=bottom
            //调用refresh()该方法重新刷新一次
            this.$refs.toplist.refresh()
        },
        _getTopList(){
            getTopList().then(res=>{
                //console.log(res.data.topList)
                this.topList=res.data.topList
            })
        }
    }
}
</script>
<style scoped lang="stylus">
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
    .rank
        position: fixed
        top: 88px
        bottom: 0
        width: 100%
        .toplist
            height:100%
            overflow:hidden
            .item
                display:flex
                margin:0 20px
                padding-top:20px
                height:100px
                &:last-child
                    padding-bottom: 20px
                .left-img
                    flex:0 0 100px
                    width:100px
                    height: 100px
                    .img
                        width:100%
                        height:100%
                .songlist
                    flex:1
                    display:flex
                    flex-direction: column
                    justify-content: center
                    padding:0 20px
                    height:100px
                    overflow:hidden
                    background:$color-highlight-banckground
                    color:$color-text-d
                    font-size:$font-size-small
                    .song
                        no-wrap()
                        line-height:26px
            .loading-container
                position: absolute
                width: 100%
                top: 50%
                transform: translateY(-50%)
</style>
