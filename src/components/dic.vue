<template>
    <transition name="slide">
        <div class="dic">
           <gedan-list :name='name1' :image="image1" :song="song"></gedan-list>
        </div>
    </transition>
</template>
<script>
import {mapGetters} from'vuex'
import { ERR_OK } from '../api/config'
import GedanList from './gedanlist'
import { createSong,processSongsUrl ,isValidMusic} from 'common/js/song'
import { getSongList } from 'api/recommend'
import {mapMutations} from'vuex'
    export default{
        components:{
            GedanList
        },
        data(){
            return{
                song:[],
                name1:'',
                image1:''
            }
        },
        computed:{
            ...mapGetters([
                'disc'
            ])
        },
        created(){
           //console.log(this.disc)
            this.geta()
            this.image1=this.disc.imgurl
            this.name1=this.disc.dissname
        },
        methods:{
           geta(){ 
               if(!this.disc.dissid){
                   this.$router.push('/recommend')
                   return
               }
               getSongList(this.disc.dissid)
               .then((res) => {
                    if (res.code === ERR_OK){
                         processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist)).then((songs)=>{
                             this.song=songs
                             console.log(this.song)
                         })
                         
                        
                    }
                })
           },
           _normalizeSongs (list) {
            let ret = []
            list.forEach((musicData) => {
            if(musicData.songid && musicData.albumid){
                ret.push(createSong(musicData))
            }
             })
            return ret
        }
        }
    }
</script>
<style scoped lang="stylus">
@import "~common/stylus/variable.styl"
    .dic
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
