<template>
    <!--//歌手详情列表 singer.vue 子路由-->
    <transition name="slide">
        <div class="singer-detail">
           <gedan-list :name='name1' :image="image1" :song="song"></gedan-list>
        </div>
    </transition>
</template>
<script>
import {mapGetters} from'vuex'
import { getSingerDetail } from '../api/singer'
import { ERR_OK } from '../api/config'
import GedanList from './gedanlist'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
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
                'singer'
            ]),
        },
        created(){
            //console.log(this.singer)
            this.geta()
            this.image1=this.singer.url
            this.name1=this.singer.name
        },
        methods:{
           geta(){ 
               if(!this.singer.id){
                   this.$router.push('/singer')
                   return
               }
               getSingerDetail(this.singer.id)
               .then((res) => {
                    if (res.code === ERR_OK){
                        //console.log(res.data.list)
                        processSongsUrl(this._normalizeSongs(res.data.list)).then((songs) => {
                            this.song = songs
                            //console.log(this.song)
                        })
                        
                    }
         
                })
           },
            _normalizeSongs (list) {
                let ret = []
                list.forEach((item) => {
                    let { musicData } = item
                    if (isValidMusic(musicData)) {
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
    .singer-detail
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
