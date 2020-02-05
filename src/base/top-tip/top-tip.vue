<template>
    <transition name="drop">
        <div class="toptip" v-show="showFlag" @click.stop="hide">
            <slot></slot>
        </div>
    </transition>
</template>
<script>
export default{
    data(){
        return{
            showFlag:false
        }
    },
    props:{
        delay:{//让父组件控制定时器时间
            type:Number,
            default:2000
        }
    },
    methods:{
        show(){
            this.showFlag=true
            clearTimeout(this.timer)
            this.timer=setTimeout(()=>{
                this.hide()
            },this.delay)
        },
        hide(){
            this.showFlag=false
        }
    }
}
</script>
<style scoped lang="stylus">
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.toptip
    position: fixed
    top:0
    width:100%
    z-index:500
    background:$color-dialog-banckground
    &.drop-enter-active, &.drop-leave-active
        transition: all 0.3s
    &.drop-enter, &.drop-leave-to
        transform:translated3d(0,-100%,0)
</style>