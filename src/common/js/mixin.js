// 当很多组件会有相同的js时，可以写公众api引用
import {mapGetters} from "vuex"
export const playlistMixin={
    computed:{
        ...mapGetters([
            'playlist'
        ])
    },
    mounted(){
        this.handlePlaylist(this.playlist)
    },
    activated(){
        this.handlePlaylist(this.playlist)
    },
    watch:{
        playlist(newval){
            this.handlePlaylist(newval)
        }
    },
    methods:{
        handlePlaylist(){
            throw new Error("component must implement handlePlaylist method")
        }
    }
}