<template>
    <!--//排行详情列表 rank.vue子路由-->
    <transition name="slide">
        <div class="ranklist">rank.vue子路由
           <gedan-list :rank="rank" :name="name" :image="imgUrl" :song="song"></gedan-list>
        </div>
    </transition>
</template>
<script>
import GedanList from './gedanlist'
import {mapGetters} from'vuex'
import {getMusicList} from 'api/rank'
import { ERR_OK } from '../api/config'
import { createSong,processSongsUrl ,isValidMusic} from 'common/js/song'
export default{
    components:{
        GedanList
    },
    data(){
        return {
            song:[],
            name:"",
            rank:true
        }
    },
    computed:{
        ...mapGetters([
            "topList"
        ]),
        imgUrl(){
            if(this.song.length){
                return this.song[0].image
            }
            return ''
        }
    },
    created(){
        //console.log(this.topList)
        this.name=this.topList.topTitle
        this.getTopList()
    },
    methods:{
        getTopList(){
            if(!this.topList.id){
                this.$router.push("/rank")
                return
            }
            //console.log(this.topList.id)
            getMusicList(this.topList.id).then((res)=>{
                 processSongsUrl(this._normalizeSongs(res.songlist)).then((songs)=>{
                    this.song=songs
                    //console.log(this.song)
                })
            })
        },
        _normalizeSongs (list) {
            let ret = []
            list.forEach((item) => {
                const musicData=item.data
            if(musicData.songid && musicData.albumid){
                ret.push(createSong(musicData))
            }
             })
            return ret
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable.styl"
.ranklist
    position:fixed
    z-index:999
    top:0
    left:0
    bottom:0
    right:0
    background:$color-banckground 
.slide-enter-active,.slide-leave-active
    transition:all .5s
.slide-enter,.slide-leave-to
    transform:translate3d(100%,0,0) 
</style>