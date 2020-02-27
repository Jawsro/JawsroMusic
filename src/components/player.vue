<template>
    <!--app.vue引入-->
    <!--播放器页面-->
    <div class="player" v-show="playlist.length>0">
        <transition name="normal"
            @enter="enter"
            @after-enter="afterEnter"
            @leave="leave"
            @after-leave="afterLeave">
            <div class="normal-player" v-show="fullScreen">
                <div class="background">
                    <img :src="currentSong.image" alt="" width="100%" height="100%">
                </div>
                <div class="top">
                    <div class="back" @click="back()">
                        <img src="../assets/down.png" alt="">
                    </div>
                    <h1 class="title" v-html="currentSong.name"></h1>
                    <h2 class="subtitle" v-html="currentSong.singer"></h2>
                </div>
                <div class="middle"
                    @touchstart.prevent="middleTouchStart"
                    @touchmove.prevent="middleTouchMove"
                    @touchend="middleTouchEnd">
                    <div class="middle-l" ref="middlel">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <div class="cd" :class="cdClass">
                                <img :src="currentSong.image" class="image" alt="">
                            </div>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">
                                {{playingLyric}}
                            </div>
                        </div>
                    </div>
                    <scroll class="middle-r"
                            ref="lyricList"
                            :data="currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper">
                            <div v-if="currentLyric">
                                <p ref="lyricLine"
                                    class="lyricLine"
                                    v-for="(line,index) in currentLyric.lines"
                                    :key="index"
                                    :class="{'current':currentLineNum=== index}">
                                    {{line.txt}}
                                </p>
                            </div>
                        </div>
                    </scroll>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active' :currentShow=== 'cd'}"></span>
                        <span class="dot" :class="{'active' :currentShow=== 'lyric'}"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="item item-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar 
                                :percent="percent"
                                @percentChange="onProgressBarChange"></progress-bar>
                        </div>
                        <span class="item item-r">{{format(currentSong.duration)}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left" @click="changeMode">
                            <img :src="iconMode" alt="">
                        </div>
                        <div class="icon i-left">
                            <img src="../assets/left.png" alt="" @click="prev()" :class="disableClass">
                        </div>
                        <div class="icon i-center">
                            <img :src="playImg" alt="" @click="goplaying()" :class="disableClass">
                        </div>
                        <div class="icon i-right">
                            <img src="../assets/right.png" alt="" @click="next()" :class="disableClass">
                        </div>
                        <div class="icon i-right">
                            <img :src="getFavoriteImg(currentSong)"
                                alt=""
                                @click="togoFavoriteImg(currentSong)">
                        </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <div class="mini-player"  v-show="!fullScreen" @click="open()">
                <div class="icon" >
                   <div class="miniicon">
                        <img :src="currentSong.image" alt="" width="40" height="40" :class="cdClass">
                   </div>
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name"></h2>
                    <p class="desc" v-html="currentSong.singer"></p>
                </div>
                <div class="control"><!--@click.stop 防止冒泡   "percent"为computed的percent()-->
                    <progress-circle :radius="radius" :percent="percent">
                        <img :src="miniplay" class="icon-mini" alt="" @click.stop="goplaying()">
                    </progress-circle>
                </div>
                <div class="control" @click.stop="showPlaylist">
                    <img src="../assets/list.png" alt="" class="icon-mini2">
                </div>
            </div>
        </transition>
        <play-list ref="playlist" 
            :sequenceList="sequenceList"
            :currentSong="currentSong"
            :playlist="playlist"
            :mode="mode">
        </play-list>
        <audio :src="currentSong.url" 
                ref="audio"
                @play="ready"
                @error="error"
                @timeupdate="updateTime"
                @ended="end"></audio>
    </div>
</template>
<script>
import Scroll from '../base/scroll/scroll'
import PlayList from"../components/playlist"
import {mapGetters,mapMutations,mapActions} from "vuex"
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/utill'
import { getLyric } from 'api/song'
import Lyric from 'lyric-parser'
import ProgressBar from '../base/progress-bar/progress-bar'
import ProgressCircle from '../base/progress-circle/progress-circle'
import { playerMixin } from 'common/js/mixin'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default{
    mixins:[playerMixin],
    components:{
        ProgressBar,
        ProgressCircle,
        Scroll,
        PlayList
    },
    data(){
        return{
            playingLyric:"",//存放背景图单句歌词
            show:true,
            currentShow: 'cd',
            currentLyric:null,//歌词
            currentLineNum:0,//当前歌词在第几行
            radius:32,
            songReady:false,
            currentTime:0//歌曲播放时间
        }
    },
    created(){
        this.touch={}//挂在共享对象
    },
    computed:{//计算
        // //根据播放状态来判断播放暂停的小图标 和图片的旋转
        // iconMode(){
        //     return this.mode ===playMode.sequence ? require("../assets/sj.png") : (this.mode ===playMode.loop ? require("../assets/1.png") :require("../assets/0.png"))
        // },
        playImg(){
            return this.playing ? require("../assets/stop1.png") : require("../assets/stop.png")
        },
        miniplay(){
             return this.playing ? require("../assets/stop1.png") : require("../assets/stop.png")
        },
        cdClass(){
            return this.playing ? "play" : "play  pause"
        },
        disableClass(){
            return this.songReady ? '': 'disable'
        },
        percent(){
            return this.currentTime /this.currentSong.duration
        },
        ...mapGetters([
            "fullScreen",
            "playing",
            "currentIndex",
            // "currentSong",
            // "playlist",
            // "mode",
            // "sequenceList"
        ])
    },
    methods:{
        showPlaylist(){
            this.$refs.playlist.show()
        },
        middleTouchStart(e){
            //已经初始化
            this.touch.initiated=true
             //点击位置 横向坐标
            this.touch.startX=e.touches[0].pageX
             //点击位置 纵向坐标
            this.touch.startY=e.touches[0].pageY
           
        },
        middleTouchMove(e){
            //没有初始化
            if(!this.touch.initiated){
                return
            }
            const touch=e.touches[0]
            const deltaX=touch.pageX-this.touch.startX
            const deltaY=touch.pageY-this.touch.startY
            //判断，纵向滚动 不操作
            if(Math.abs(deltaY)>Math.abs(deltaX)){
                return
            }
            const left=this.currentShow ==='cd'? 0 : -window.innerWidth
            const offsetWidth= Math.min(0,Math.max(-window.innerWidth,left+deltaX))
            this.$refs.lyricList.$el.style[transform]=`translate3d(${offsetWidth}px,0,0)`
            this.$refs.lyricList.$el.style[transitionDuration]=0
            this.touch.percent =Math.abs(offsetWidth/window.innerWidth)
            this.$refs.middlel.style.opacity=1- this.touch.percent
            this.$refs.middlel.style[transitionDuration]=0
        },
        middleTouchEnd(){
            let offsetWidth
            let opacity
            if(this.currentShow==='cd'){//从右向左
            //滑动的距离超过10%
                if(this.touch.percent>0.1){
                    offsetWidth =-window.innerWidth
                    opacity=0
                    this.currentShow="lyric"
                }else{
                    offsetWidth=0
                    opacity=1
                }
            }else{//从左向右
            //滑动的距离不超过80%
                if(this.touch.percent<0.9){
                    offsetWidth=0
                    this.currentShow='cd'
                    opacity=1
                }else{
                    offsetWidth =-window.innerWidth 
                    opacity=0
                }
            }
            const time=300
            this.$refs.lyricList.$el.style[transform]=`translate3d(${offsetWidth}px,0,0)`
            this.$refs.lyricList.$el.style[transitionDuration]=`${time}ms`
            this.$refs.middlel.style.opacity=opacity
            this.$refs.middlel.style[transitionDuration]=`${time}ms`
        },
        getLyric(){
            this.currentSong.getLyric().then((lyric)=>{
                if(this.currentSong.lyric!==lyric){
                    return
                }
                this.currentLyric=new Lyric(lyric,this.handleLyric)
                //console.log(this.currentLyric)
                if(this.playing){
                    //如果歌曲正在播放的时候，歌词播放
                    this.currentLyric.play()
                }
            }).catch(()=>{
                this.currentLyric=null;
                this.playingLyric='';
                this.currentLineNum=0
            })
        },
        handleLyric({lineNum,txt}){
            //lineNum 播放当前歌词在第几行
            this.currentLineNum= lineNum
            if(lineNum>5){
                //大于5行的时候，为了current在中间
                let num=this.$refs.lyricLine[lineNum-5]
                this.$refs.lyricList.scrollToElement(num,1000)
            }else{
                this.$refs.lyricList.scrollTo(0,0,1000)
            }
            this.playingLyric =txt
        },
       
        onProgressBarChange(percent){
            //设置当前 进度条的时间        当前歌曲总时长
            const currentTime=this.currentSong.duration * percent
            this.$refs.audio.currentTime =currentTime
            //console.log( this.$refs.audio.currentTime)
            if(!this.playing){
                this.goplaying()
            }
            if(this.currentLyric){
                this.currentLyric.seek(currentTime*1000)
            }
        },
        updateTime(e){
            this.currentTime=e.target.currentTime
        },
        format(interval){
            //把时间转成分，秒
            interval = interval | 0// | 相当于向下取整
            const minute =interval/60 | 0
            const second = (interval % 60).toString().padStart(2, '0')
            return `${minute}:${second}`
        },
        prev(){
            //点击上一首
            if(!this.songReady){
                return
            }
            if(this.playlist.length ===1){
                this.loop()
                return
            }else{
            let index=this.currentIndex-1
            if(index===-1){
                //当index===-1，歌曲从最后首向前一首开始
                index=this.playlist.length-1
            }
            this.setCurrentIndex(index)
            if(!this.playing){
                this.goplaying()
            }
            }
            this.songReady=false
        },
        next(){
            //点击下一首
            if(!this.songReady){
                return
            }
            //判断歌曲列表只有一首歌的情况，单曲循环
            if(this.playlist.length ===1){
                this.loop()
                return
            }else{
            let index=this.currentIndex+1
            if(index===this.playlist.length){
                //当index===this.playlist.length，歌曲从第一首向下一首开始
                index=0
            }
            this.setCurrentIndex(index)
            if(!this.playing){
                this.goplaying()
            }
            }
            this.songReady=false
        },
        goplaying(){
            //歌曲播放暂停功能
            if(!this.songReady){
                return
            }
            this.setPlayingState(!this.playing)//调用方法
            if(this.currentLyric){
                this.currentLyric.togglePlay()
            }
        },
        ready(){
            this.songReady=true
            this.savePlayHistory(this.currentSong)
        },
        error(){
            this.songReady=true
        },
        end(){
            //1.如果是单曲循环调用loop()
            if(this.mode===playMode.loop){
                this.loop()
            }else{
                this.next()
            }
        },
        loop(){
            this.$refs.audio.currentTime=0
            this.$refs.audio.play()
            if(this.currentLyric){
                this.currentLyric.seek(0)
            }
        },
        ...mapMutations({
            setFullScreen:"SET_FULL_SCREEN",
            //setPlayingState:"SET_PLAYING_STATE",//全局播放函数调用
            //setCurrentIndex:"SET_CURRENT_INDEX",
            //setPlayMode:"SET_PLAY_MODE",
            //setPlaylist:"SET_PLAYLIST"
        }),
        ...mapActions([
            'savePlayHistory'
        ]),
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
    },
    watch:{
        currentSong(newSong,oldSong){
            if(!newSong.id){
                return
            }
            //歌曲id不变，不操作
            if(newSong.id===oldSong.id){
                return
            }
            if(this.currentLyric){
                this.currentLyric.stop()
                // 重置为null
                this.currentLyric = null
                this.currentTime = 0
                this.playingLyric = ''
                this.currentLineNum = 0
            }
            //清除定时器，只执行最后一次定时器内的操作
            clearTimeout(this.timer)
            //延时，操作dom
            this.timer=setTimeout(()=>{
                this.$refs.audio.play()
                this.getLyric()
            },1000)
            
        },
        playing(newPlaying){//监听当前的播放状态
            const audio=this.$refs.audio;
            //newPlaying 保存此时播放的状态 play()播放  pause()暂停
            setTimeout(()=>{
                newPlaying ? audio.play() : audio.pause()
            },1000)
            
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
            .middle-r
                display:inline-block
                vertical-align:top
                width:100%
                height:100%
                overflow:hidden
                .lyric-wrapper
                    width:80%
                    margin:0 auto
                    overflow:hidden
                    text-align:center
                    .lyricLine
                        line-height:32px
                        color: $color-text-l
                        font-size: $font-size-medium
                        &.current
                            color: #e2ab00
            .middle-l
                display: inline-block
                vertical-align: top
                position: relative
                width: 100%
                height: 0
                padding-top: 80%
                .playing-lyric-wrapper
                    width:80%
                    margin:30px auto 0
                    overflow:hidden
                    text-align:center
                    .playing-lyric
                        height:20px
                        line-height:20px
                        font-size:$font-size-medium
                        color:$color-text-l
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
                        box-sizing:border-box
                        border:10px solid rgba(225,225,225,0.1)
                        &.play
                            animation:rotate 20s linear infinite
                        &.pause
                            animation-play-state:paused
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
            .dot-wrapper
                text-align:center
                font-size:0
                .dot
                    display:inline-block
                    vertical-align:middle
                    margin:0 4px
                    width:8px
                    height:8px
                    border-radius:50%
                    background:$color-text-ll
                    &.active
                        width:20px
                        border-radius:5px
                        background:$color-text-ll
            .progress-wrapper
                display:flex
                align-items:center
                width:80%
                margin:0 auto
                padding:10px 0
                .item
                    color:$color-text
                    font-size:$font-size-small
                    flex:0 0 30px
                    line-height:30px
                    width:30px
                    &.time-l
                        text-align:left
                    &.time-r
                        text-align:right
                .progress-bar-wrapper
                    flex:1
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
            .miniicon
                width:100%
                height:100%
                img
                    border-radius:50%
                    &.play
                        animation:rotate 20s linear infinite
                    &.pause
                        animation-play-state:paused
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
            .icon-mini 
                width:32px
                height:32px
                position:absolute
                top:0px
                left:0
            .icon-mini2
                width:32px
                height:32px
@keyframes rotate
    0%
        transform: rotate(0)
    100%
        transform: rotate(360deg)
</style>
