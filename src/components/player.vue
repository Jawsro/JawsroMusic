<template>
    <div class="player" v-show="playlist.length>0">
        <transition name="normal"
            @enter="enter"
            @after-enter="afterEnter"
            @leave="leave"
            @after-leave="afterLeave">
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img :src="currentSong.image" alt="" width="100" height="100">
                </div>
                <div class="top">
                    <div class="back" @click="back()">
                        <img src="../assets/down.png" alt="">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle">
                    <div class="middle-l">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd">
                                <img :src="currentSong.image" class="image" alt="">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom">
                    <div class="operators">
                        <div class="icon i-left">
                            <img src="../assets/sj.png" alt="">
                            <i class="icon-sequence"></i>
                        </div>
                        <div class="icon i-left">
                            <img src="../assets/left.png" alt="">
                            <i class="icon-prev"></i>
                        </div>
                        <div class="icon i-center">
                            <img src="../assets/stop.png" alt="">
                            <i class="icon-pley"></i>
                        </div>
                        <div class="icon i-right">
                            <img src="../assets/right.png" alt="">
                            <i class="icon-next"></i>
                        </div>
                        <div class="icon i-right" @click="aa()">
                            <img src="../assets/sc0.png" alt="">
                            <i class="icon icon-not-favorite"></i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player"  v-show="!fullScreen" @click="open()">
                <div class="icon">
                    <img :src="currentSong.image" alt="" width="40" height="40">
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control">
                    <img src="../assets/stop.png" alt="">
                </div>
                <div class="control">
                    <img src="../assets/list.png" alt="">
                    <i class="icon-playlist"></i>
                </div>
            </div>
        </transition>
        <audio :src="currentSong.url"></audio>
    </div>
</template>
<script>
import {mapGetters,mapMutations} from "vuex"
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'

const transform = prefixStyle('transform')
export default{
    created(){
        //console.log(playlist)
    },
    computed:{
        ...mapGetters([
            "fullScreen",
            "playlist",
            "currentSong",
            "currentIndex"
            
        ])
    },
    methods:{
        aa(){
            console.log(this.currentSong,this.playlist)
        },
        ...mapMutations({
            setFullScreen:"SET_FULL_SCREEN"
        }),
        back(){
            this.setFullScreen(false)
        },
        open(){
            this.setFullScreen(true)
        },
        enter(el,done){
            const {x,y,scale}=this.getPosAndScale();
            let animation={
                0:{
                    transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
                },
                60:{
                    transform:`translate3d(0,0,0) scale(1.1)`
                },
                100:{
                    transform:`translate3d(0,0,0) scale(1)`
                }
            }
            animations.registerAnimation({
                name: 'move',//动画名称
                animation,//动画
                presets: {
                    duration: 400,//动画间隔
                    easing: 'linear'
                }
            })
            //参数一：执行的dom
            //参数二：动画名称
            //参数三：done函数，跳到afterEnter
            animations.runAnimation(this.$refs.cdWrapper,"move",done)
        },
        afterEnter(){
            //清空动画
            animations.unregisterAnimation("move")
            this.$refs.cdWrapper.style.animation=''
        },
        leave(el,done){
            this.$refs.cdWrapper.style.transition="all 0.4s"
            const {x,y,scale}=this.getPosAndScale();
            this.$refs.cdWrapper.style[transform]=`translate3d(${x}px,${y}px,0) scale(${scale})`
            //监听事件，动画结束，调用done函数
            this.$refs.cdWrapper.addEventListener("transitionend",done)
        },
        afterLeave(){
            //清空动画
             this.$refs.cdWrapper.style.transition=""
             this.$refs.cdWrapper.style[transform]=""
        },
        getPosAndScale(){
            const targetWidth = 40
            const paddingLeft = 40
            const paddingBottom = 30
            const paddingTop = 80
            const width = window.innerWidth * 0.8
            const scale = targetWidth / width
            const x = -(window.innerWidth / 2 - paddingLeft)
            const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
            return {
            x,
            y,
            scale
            }
        }
    }

}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.player
    .normal-player
        position: fixed
        left: 0
        right: 0
        top: 0
        bottom: 0
        z-index: 150
        background:$color-banckground
        .background
            position: absolute
            left: 0
            top: 0
            width: 100%
            height: 100%
            z-index: -1
            opacity: 0.6
            filter: blur(20px)
        .top
            position: relative
            margin-bottom: 25px
            .back
                position: absolute
                top: 9px
                left: 6px
                width:30px 
                height:30px
                z-index: 50
                img 
                    width:100%
                    height:100%
                .icon-back
                    display: block
                    padding: 9px
                    font-size: $font-size-large-x
                    color: $color-theme
                    transform: rotate(-90deg)
            .title
                width: 70%
                margin: 0 auto
                line-height: 40px
                text-align: center
                no-wrap()
                font-size: $font-size-large
                color: $color-text
            .subtitle
                line-height: 20px
                text-align: center
                font-size: $font-size-medium
                color: $color-text
        .middle
            position: fixed
            width: 100%
            top: 80px
            bottom: 170px
            white-space: nowrap
            font-size: 0
            .middle-l
                display: inline-block
                vertical-align: top
                position: relative
                width: 100%
                height: 0
                padding-top: 80%
                .cd-wrapper
                    position: absolute
                    left: 10%
                    top: 0
                    width: 80%
                    box-sizing: border-box
                    height: 100%
                    .cd
                        width: 100%
                        height: 100%
                        border-radius: 50%
                        .image
                            position: absolute
                            left: 0
                            top: 0
                            width: 100%
                            height: 100%
                            box-sizing: border-box
                            border-radius: 50%
                            border: 10px solid rgba(255, 255, 255, 0.1)
        .bottom
            position: absolute
            bottom: 50px
            width: 100%
            .operators
                display: flex
                align-items: center
                .icon
                    flex: 1
                    img 
                        width:30px
                        height:30px
                .i-left
                    text-align: right
                .i-center
                    padding: 0 20px
                    text-align: center
                .i-right
                    text-align: left
        &.normal-enter-active, &.normal-leave-active
            transition: all .4s
            .top, .bottom
                transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
        &.normal-enter, &.normal-leave-to
            opacity: 0
            .top
                transform: translate3d(0, -100px, 0)
            .bottom
                transform: translate3d(0, 100px, 0)
    .mini-player
        display: flex
        align-items: center
        position: fixed
        left: 0
        bottom: 0
        z-index: 180
        width: 100%
        height: 60px
        background: $color-highlight-banckground
        &.mini-enter-active, &.mini-leave-active
            transition: all .4s
        &.mini-enter, &.mini-leave-to
            opacity: 0
        .icon
            flex: 0 0 40px
            width: 40px
            height: 40px
            padding: 0 10px 0 20px
        .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            .name
                margin-bottom: 2px
                no-wrap()
                font-size: $font-size-medium
                color: $color-text
            .desc
                no-wrap()
                font-size: $font-size-small
                color: $color-text-d
        .control
            flex: 0 0 30px
            width: 30px
            padding: 0 10px
            img 
                width:30px
                height:30px
</style>
