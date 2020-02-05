// 当很多组件会有相同的js时，可以写公众api引用,引用的组件可以直接使用
import {mapGetters,mapMutations,mapActions} from "vuex"
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/utill'

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

export const playerMixin={
    computed:{
        iconMode(){
            return this.mode ===playMode.sequence ? require("../../assets/sj.png") : (this.mode ===playMode.loop ? require("../../assets/1.png") :require("../../assets/0.png"))
        },
        ...mapGetters([
            "playlist",
            "currentSong",
            "mode",
            "sequenceList",
            "favoriteList"
        ])
    },
    methods:{
        //点击收藏图片触发事件
        togoFavoriteImg(song){
            if(this._isFavorite(song)){
                this.deleteFavoriteList(song)
            }else{
                this.saveFavoriteList(song)
            }
        },
        //切换图片
        getFavoriteImg(song){
            if(this._isFavorite(song)){
                return require("../../assets/sc.png")
            }
            return require("../../assets/sc0.png")
        },
        //封装方法
        _isFavorite(song){
            const index=this.favoriteList.findIndex((item)=>{
                return item.id===song.id
            })
            return index>-1
        },
        //歌曲播放页面和歌曲添加页面的播放状态可以同步
        changeMode(){
            //切换播放顺序
            const mode=(this.mode+1)%3
            this.setPlayMode(mode)
            let list=null
            if(mode===playMode.random){
                //如果是随机播放
                list=shuffle(this.sequenceList)
            }else{
                list=this.sequenceList
            }
            this.resetCurrentIndex(list)
            //传给vuex，修改全局变量
            this.setPlaylist(list)
        },
         resetCurrentIndex(list){
            let index=list.findIndex((item)=>{
                return item.id===this.currentSong.id
            })
            this.setCurrentIndex(index)
        },
        ...mapMutations({
            setPlayMode: 'SET_PLAY_MODE',
            setPlaylist: 'SET_PLAYLIST',
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayingState: 'SET_PLAYING_STATE'
        }),
        ...mapActions([
            'saveFavoriteList',
            'deleteFavoriteList'
        ])
    }
}
//add-song.vue search.vue公用js
export const searchMixin={
    data(){
        return{
            query:'',
            refreshDelay:120
        }
    },
     computed:{
          ...mapGetters([
            "searchHistory"
        ]),
     },
     methods:{
         ...mapActions([
            "saveSearchHistory",
            "deleteSearchHistory"
        ]),
        addQuery(query){
            //点击关键词，同步到搜素框
            //setQuery()  调用search-box.vue里面的方法
            this.$refs.searchbox.setQuery(query)
        },
        saveSearch(){
            this.saveSearchHistory(this.query)
        },
        blurInput(){
            //调用子组件search-box.vue的blur() 方法
            this.$refs.searchbox.blur() 
        },
         queryChange(query){
            this.query=query
        },
     }
}