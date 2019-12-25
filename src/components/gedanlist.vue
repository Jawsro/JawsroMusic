<template>
<!--  歌手的歌单列表-->
    <div class="gadenlist">
        <div class="back" @click="goback()">
            <img src="../assets/back.png" alt="" class="topimg">
        </div>
        <div class="name">
            {{name}}
        </div>
        <div class="banner" :style="{backgroundImage:'url('+image+')'}"  ref="bgImage">
            <div class="play-wrapper">
                <div ref="playBtn" v-show="song.length>0" class="play" @click="random">
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="mask" ref="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scroll :data="song" 
                class="songlist" 
                ref="songlist"
                :linsten-scroll="linstenScroll"
                :prober-type="proberType"
                @scroll="scroll"
                >
            <div class="songlist-wrapper" ref="songlistwrapper">
                <song-list :song="song"></song-list>
            </div>
            <div class="loading-container" v-show="!song.length">
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>
<script>
import Scroll from '../base/scroll/scroll'
import Loading from '../base/loading/loading'
import SongList from '../base/songlist/songlist'
import { prefixStyle } from 'common/js/dom'
const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
export default{
    name:"Gedanlist",
    components:{
        Scroll,
        SongList,
        Loading
    },
    data(){
        return{
            scrollY:0
        }
    },
    created(){
        // this.touch={}//不需要监听数据的变化，可以直接在creadted中定义
        this.linstenScroll=true
        // this.listHeight=[]
        this.proberType=3
    },
    props:{
        name:{
            type:String,
            default:""
        },
        image:String,
        song:Array
    },
    data(){
        return{
                scrollY:0,
            // list:[],
           // id:this.$route.params.id,//将URL地址中传递过来的ID值，直接挂载在data上，方便以后调用
        }
    },
    mounted(){
        this.imageHeight = this.$refs.bgImage.clientHeight
        this.minTransalteY = -this.imageHeight+ RESERVED_HEIGHT //最小滚动高
        this.$refs.songlist.$el.style.top = `${this.imageHeight}px`
    },
    methods:{
        random(){
            //点击  随机播放按钮
        },
        scroll(pos){
            this.scrollY=pos.y
        },
        goback(){
            this.$router.go(-1)
        }
    },
    watch: {
        scrollY(newY){
            let zIndex=0;
            let scale = 1;
            let blur = 0;
            if (newVal > 0) {
                scale = 1 + percent
                zIndex = 10
            } else {
                blur = Math.min(20, percent * 20)
            }
            let translateY = Math.max(this.minTransalteY,newY);
            const percent = Math.abs(newVal / this.imageHeight)
            this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`
            this.$refs.filter.style[backdrop] = `blur(${blur}px)`
            if(newY<this.minTransalteY){
                zIndex=10
                this.$refs.bgImage.style.paddingTop=0
                this.$refs.bgImage.style.height= `${RESERVED_HEIGHT}px`
                this.$refs.playBtn.style.display = 'none'
            }else {
                this.$refs.bgImage.style.paddingTop='70%'
                this.$refs.bgImage.style.height= 0
                this.$refs.playBtn.style.display = ''
            }
            this.$refs.bgImage.style[transform] = `scale(${scale})`
            this.$refs.bgImage.style.zIndex = zIndex
        }  
    },
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable.styl"
    .gadenlist
        position:fixed
        top:0
        left:0
        right:0
        bottom:0
        z-index:99
        background:$color-banckground
        .back
            position:absolute
            top:0
            left:6px
            height: 40px
            line-height:40px
            width:40px
            text-align:center
            z-index:99
            .topimg
                height:22px
                width:22px
                vertical-align: middle
        .name
            position:absolute
            top:0 
            left:10% 
            height: 40px
            line-height:40px
            text-align:center 
            width:80%
            font-size:$font-size-medium-x
            color:$color-text 
            z-index:99       
        .banner
            position: relative
            width: 100%
            height: 0
            padding-top: 70%
            transform-origin: top
            background-size: cover
            .play-wrapper
                position: absolute
                bottom: 20px
                z-index: 50
                width: 100%
                .play
                    box-sizing: border-box
                    width: 135px
                    padding: 7px 0
                    margin: 0 auto
                    text-align: center
                    border: 1px solid $color-theme
                    color: $color-theme
                    border-radius: 100px
                    font-size: 0
                    .text
                        display: inline-block
                        vertical-align: middle
                        font-size: $font-size-small
            .mask
                position:absolute
                top:0
                left:0
                width:100%
                height:100%
                background: rgba(7,17,27,.4)
        .bg-layer
            position:relative
            height:100%
            background:$color-banckground
        .songlist
            position: absolute
            top: 0
            bottom: 0
            width: 100%
            background:$color-banckground
            .songlist-wrapper
                padding: 20px 30px
                          
</style>

