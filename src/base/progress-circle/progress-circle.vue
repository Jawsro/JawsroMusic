<template>
    <div class="progress-circle">
        <!--
            viewBox 100 100 和下面的circle半径r对应的
        -->
        <svg :width="radius" 
            :height="radius" 
            viewBox="0 0 100 100" 
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
        >
        <!--
            r 半径
            cy cx 圆心位置
            stroke-dasharray 描边
            stroke-dashoffset 描边的偏移
        -->
            
            <circle class="progress-background" 
                r="50"
                cy="50"
                cx="50"
                fill="transparent"/>
            <circle class="progress-bar" 
                r="50"
                cy="50"
                cx="50"
                fill="transparent"
                :stroke-dasharray="dasharray"
                :stroke-dashoffset="dashoffset"/>
        </svg>
        <!-- <slot></slot> 可以包裹任何元素-->
        <slot></slot>
    </div>
</template>
<script>
export default {
    data(){
        return{
            dasharray:Math.PI*100
        }
    },
    props:{
        radius:{
            type:Number,
            default:100
        },
        percent:{
            type:Number,
            default:0
        }
    },
    computed:{
        dashoffset(){
            return(1-this.percent)*this.dasharray
        }
    }
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable.styl"
    .progress-circle
        position:relative
        circle
            stroke-width: 8px
            transform-origin: center
            &.progress-background
                transform: scale(0.9)
                stroke: $color-theme-d
            &.progress-bar
                transform: scale(0.9) rotate(-90deg)
                stroke: $color-theme
</style>