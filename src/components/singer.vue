<template>
    <div class="singer"  ref="singer">
    <singer-view :data="SingerList" ref="list" @select="selectSinger"></singer-view>
    <router-view/>
    </div>
</template>
<script>
import { playlistMixin } from 'common/js/mixin'
import Singer from 'common/js/singer'
import SingerView from '../base/singer/singerlist'
import {mapMutations} from'vuex'
import { getSingerList } from 'api/singer'
 import { ERR_OK } from 'api/config'
    const HOT_NAME="热门";
    const HOT_SINGER_LEN=10;

    export default{
        mixins:[playlistMixin],
        components:{
            // Scroll,
            // Loading
              SingerView
        },
        data(){
            return{
                SingerList:[]
            }
        },
        created(){
        //   this.getSingerList();
            this._getSingerlist();
        },
        methods:{
             handlePlaylist (playlist) {
                const bottom = playlist.length > 0 ? '60px' : ''
                this.$refs.singer.style.bottom = bottom
                this.$refs.list.refresh()
            },
            selectSinger(item){
                this.$router.push({
                    path:`/singer/${item.id}`
                })
                this.setSinger(item)
            },
            _getSingerlist(){
                getSingerList().then((res) => {
                    if (res.code === ERR_OK) {
                        //console.log(res.data.list)
                        this.SingerList = this.geshoulist(res.data.list)
                        //console.log(this.SingerList)
                    }
                })
            },
            geshoulist(list){
                let map={
                    hot:{
                        title:HOT_NAME,
                        items:[]
                    }
                }
                list.forEach((item,index)=>{
                    if(index<HOT_SINGER_LEN){
                        map.hot.items.push(
                            new Singer({
                                id:item.Fsinger_mid,
                                name:item.Fsinger_name
                            })
                        )
                    }
                    const key =item.Findex
                    if(!map[key]){
                        map[key]={
                            title:key,
                            items:[]
                        }
                    }
                    map[key].items.push(new Singer({
                            id:item.Fsinger_mid,
                            name:item.Fsinger_name
                        }))
                })
                //为了得到有序列表，处理map
                let hot=[];
                let arr=[];
                for(let key in map){
                    let word=map[key]
                    if(word.title.match(/[a-zA-Z]/)){
                        arr.push(word)
                    }else if(word.title===HOT_NAME){
                        hot.push(word)
                    }
                }
                arr.sort((a,b)=>{
                    return a.title.charCodeAt(0)-b.title.charCodeAt(0)
                })
                //console.log(hot,arr)
                    return hot.concat(arr)
            },
            ...mapMutations({
                setSinger:'SET_SINGER'
            })
        }
    }
</script>
<style scoped lang="stylus">
.singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
