<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>
<script>
    import BScroll from 'better-scroll'
    export default{
        props:{
            probeType:{
                type:Number,
                default:1
            },
            click:{
                type:Boolean,
                default:true
            },
            data:{
                type:Array,
                default:null
            },
            linstenScroll :{//scroll是否去监听scroll事件
                type:Boolean,
                default:false
            },
            pullup:{//上拉刷新
                type:Boolean,
                default:false
            },
            beforeScroll:{
                type:Boolean,
                default:false
            },
            refreshDelay:{//定时器时间
                type:Number,
                default:20
            }
        },
        mounted(){
            setTimeout(()=>{
                this._initScroll()
            },20)
        },
        methods:{
            _initScroll(){
                if(!this.$refs.wrapper){
                    return
                }
                this.scroll=new BScroll(this.$refs.wrapper,{
                    probeType:this.probeType,
                    click:this.click
                })
                if(this.linstenScroll){
                    let me=this
                    this.scroll.on('scroll',(pos)=>{
                        me.$emit('scroll',pos)
                    })
                }
                if(this.pullup){
                    //scrollEnd表示scroll停止了
                    //scrollToEn表示滚动到底部了
                     this.scroll.on('scrollEnd',()=>{
                        if(this.scroll.y <= (this.scroll.maxScrollY + 50)){
                             this.$emit('scrollToEnd')
                        }
                    })
                }
                if(this.beforeScroll){
                    this.scroll.on("beforeScrollStart",()=>{
                        this.$emit("beforeScroll")
                    })
                }
            },
            enable(){
                this.scroll && this.scroll.enable()
            },
            disable(){
                this.scroll && this.scroll.disable()
            },
            refresh(){
                this.scroll && this.scroll.refresh()
            },
            scrollTo(){
                this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
            },
            scrollToElement(){
                this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
            },
        },
        watch:{
            data(){
                setTimeout(()=>{
                    this.refresh()
                },this.refreshDelay)
            }
        }
    }
</script>
<style lang="stylus" scoped>

</style>