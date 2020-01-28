<template>
<!--进度条组件-->
    <div class="progress-bar" ref="progressBar" @click="progressClick">
        <div class="bar-inner" >
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper">
                <div class="progress-btn" 
                    ref="progressBtn"
                    @touchstart.prevent="progressTouchStart"
                    @touchmove.prevent="progressTouchMove"
                    @touchend="progressTouchEnd"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { prefixStyle } from 'common/js/dom'
const transform = prefixStyle('transform')
const btnWidth=16
export default{
    props:{
        percent:{
            type:Number,
            default:0
        }
    },
    created(){
        this.touch={}//挂在共享对象
    },
    methods:{
        progressClick(e){
            //点击进度条，经跳到相应的进度
            console.log(e)
            //当点击progressBtn时，
            const rect = this.$refs.progressBar.getBoundingClientRect()
            const offsetWidth = e.pageX - rect.left
            this._offset(offsetWidth)
            //this._offset(e.offsetX)
            this._triggerPercent()
        },
        progressTouchStart(e){
            //已经初始化
            this.touch.initiated=true
            //点击位置 横向坐标
            this.touch.startX=e.touches[0].pageX
            //当前按钮的位置=进度条的宽度
            this.touch.left=this.$refs.progress.clientWidth
        },
        progressTouchMove(e){
            //没有初始化
            if(!this.touch.initiated){
                return
            }
            //点击按钮移动的距离
            const deltaX=e.touches[0].pageX-this.touch.startX
            //不能溢出屏幕不能小于0 不能大于进度条总宽度
            const offsetWidth=Math.min(this.$refs.progressBar.clientWidth-btnWidth,Math.max(0,this.touch.left+deltaX))
            // this.$refs.progress.style.width=`${offsetWidth}px`
            // this.$refs.progressBtn.style[transform]=`translate3d(${offsetWidth}px,0,0)`
            this._offset(offsetWidth)
        },
        progressTouchEnd(e){
            this.touch.initiated=false
            this._triggerPercent()
        },
        _triggerPercent(){
            const barWidth=this.$refs.progressBar.clientWidth-btnWidth
            const percent=this.$refs.progress.clientWidth/barWidth
            this.$emit('percentChange',percent)
        },
        _offset(offsetWidth){
            this.$refs.progress.style.width=`${offsetWidth}px`
            this.$refs.progressBtn.style[transform]=`translate3d(${offsetWidth}px,0,0)`
        }
    },
    watch:{
        percent(newPercent){
            if(newPercent>=0 &&!this.touch.initiated){
                const barWidth=this.$refs.progressBar.clientWidth-btnWidth
                const offsetWidth=newPercent*barWidth
                this.$refs.progress.style.width=`${offsetWidth}px`
                this.$refs.progressBtn.style[transform]=`translate3d(${offsetWidth}px,0,0)`
                //console.log(offsetWidth)
            }
        },
    }
    
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable.styl"
.progress-bar
    height:30px
    .bar-inner
        position: relative
        top: 13px
        height: 4px
        background: rgba(0, 0, 0, 0.3)
        .progress
            position: absolute
            height: 100%
            background: $color-theme
        .progress-btn-wrapper
            position: absolute
            left: -8px
            top: -13px
            width: 30px
            height: 30px
            .progress-btn
                position: relative
                top: 7px
                left: 7px
                box-sizing: border-box
                width: 16px
                height: 16px
                border: 3px solid $color-text
                border-radius: 50%
                background: $color-theme
</style>