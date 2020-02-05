<template>
    <transition name="slide">
        <div class="add-song" v-show="showFlag" @click.stop>
            <div class="header">
                <h1 class="title">添加歌曲列表</h1>
                <div class="close" @click="hide">
                    <img src="../assets/dismiss1.png" alt="">
                </div>
            </div>
            <div class="search-box-wrapper">
                <search-box ref="searchbox" @query="queryChange"
                    placeholder="搜索歌曲"></search-box>
            </div>
            <div class="shortcut" v-show="!query">
                <switches :currentIndex="currentIndex"
                    :switches="switches"
                    @switch="switchItem">
                </switches>
                <div class="list-wrapper">
                    <!--最近播放-->
                    <scroll v-if="currentIndex===0" 
                        class="list-scroll"
                        :data="playHistory"
                        ref="playhistory">
                        <div class="list-inner">
                            <song-list :song="playHistory" @select="selectSong"></song-list>
                        </div>
                    </scroll>
                    <!--搜索历史-->
                    <scroll v-if="currentIndex===1" 
                        class="list-scroll" 
                        :data="searchHistory"
                        ref="searchhistory"
                        :refreshDelay="refreshDelay">
                        <div class="list-inner">
                            <searchhistory-list @delete="deleteSearchHistory"
                                @select="addQuery"
                                :seraches="searchHistory">
                            </searchhistory-list>
                        </div>
                    </scroll>
                </div>
            </div>
            <div class="search-result" v-show="query">
                 <search-list 
                    :query="query" 
                    :showSinger="showSinger"
                    @listScroll="blurInput"
                    @select="selectSuggest"
                    ref="searchlist">
                </search-list>
            </div>
            <top-tip ref="toptip">
                <div class="tip-title">
                    <img src="../assets/yes.png" alt="">
                    <span class="text">一首歌曲已经添加到播放队列</span>
                </div>
            </top-tip>
        </div>
    </transition>
</template>
<script>
import SearchBox from '../base/search-box/search-box'
import Scroll from '../base/scroll/scroll'
import Switches from '../base/switches/switches'
import SongList from '../base/songlist/songlist'
import SearchhistoryList from '../base/search-list/search-list'
import TopTip from '../base/top-tip/top-tip'
import SearchList from"../components/searchlist"
import { searchMixin } from 'common/js/mixin'
import Song from 'common/js/song'
import {mapGetters,mapActions} from "vuex"
    export default{
        mixins:[searchMixin],
        data(){
            return{
                showFlag:false,
                showSinger:false,
                currentIndex:0,
                switches:[
                    {name:'最近播放'},
                    {name:'搜索历史'}
                ]
            }
        },
        components:{
            SearchBox,
            SearchList,
            Switches,
            Scroll,
            SongList,
            SearchhistoryList,
            TopTip
        },
        computed:{
            ...mapGetters([
                'playHistory'
            ])
        },
        methods:{
            show(){
                this.showFlag=true
                setTimeout(()=>{
                    if(this.currentIndex===0){
                        this.$refs.playhistory.refresh()
                    }else{
                         this.$refs.searchhistory.refresh()
                    }
                },20)
            },
            hide(){
                 this.showFlag=false
            },
            selectSuggest(){
                 this.saveSearch()
                 this._showTip()
            },
            switchItem (index) {
                this.currentIndex = index
            },
            selectSong(song,index){
                if(index!==0){
                    this.insertSong(new Song(song))
                    this._showTip()
                }
            },
            _showTip(){
                this.$refs.toptip.show()
            },
            ...mapActions([
                'insertSong'
            ])
        }
    }
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-banckground
    &.slide-enter-active, &.slide-leave-active
        transition: all 0.3s
    &.slide-enter, &.slide-leave-to
        transform: translate3d(100%, 0, 0)
    .header
        position: relative
        height: 44px
        text-align: center
        .title
            line-height: 44px
            font-size: $font-size-large
            color: $color-text
        .close
            position: absolute
            top: 0
            right: 8px
            img
                width:20px
                height:20px
                display: block
                padding: 12px
.search-box-wrapper
      margin: 20px
.shortcut
    .list-wrapper
        position:absolute
        top:165px
        bottom:0
        width:100%
        .list-scroll
            height:100%
            overflow: hidden
            .list-inner
                padding:20px 30px
.search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
.tip-title
    text-align:center
    padding:18px 0
    font-size:0
    img
        width:20px 
        height:20px
    .text
        color:$color-text
        font-size:$font-size-medium 
</style>