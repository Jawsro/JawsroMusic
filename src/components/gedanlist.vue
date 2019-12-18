<template>
    <div class="gadenlist">
        <div class="back" @click="goback()">
            <img src="../assets/back.png" alt="" class="topimg">
        </div>
        <div class="name">
            {{name}}
        </div>
        <div class="banner" :style="{backgroundImage:'url('+image+')'}"  ref="bgImage">
            <!-- <img :src="image" class="img"> -->
            <div class="mask"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scroll :data="song" 
                class="songlist" 
                ref="songlist"
                :linsten-Scroll="linstenScroll"
                :prober-type="proberType"
                @scroll="scroll"
                >
            <div class="songlist-wrapper" ref="songlistwrapper">
                <song-list :song="song"></song-list>
            </div>
        </scroll>
    </div>
</template>
<script>
import Scroll from '../base/scroll/scroll'
import SongList from '../base/songlist/songlist'
 const RESERVED_HEIGHT = 40
    export default{
        name:"Gedanlist",
        components:{
            Scroll,
            SongList
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
            //console.log(this.name)
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
                 scrollY:0
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
            scroll(pos){
                this.scrollY=pos.y
            },
            goback(){
                this.$router.go(-1)
            }
        },
        watch: {
            scrollY(newY){
                let translateY = Math.max(this.minTransalteY,newY)
                this.$refs.layer.style['transform'] = `translate3d(0,${newY}px,0)`
                this.$refs.layer.style['webkitTransform']=`translate3d(0,${newY}px,0)`
                
            }  
        },
      
            // getList(){
            //     console.log(this.id)
            //     let obj={disstid:this.id}
            //     this.$ajax.get("http://ustbhuangyi.com/music/api/getCdInfo?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&type=1&json=1&utf8=1&onlysong=0&platform=yqq&hostUin=0&needNewCode=0",{params:obj})
            //     .then(res=>{
            //         console.log(res.data.cdlist[0].songlist)

            //     })
            // }
            
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
            .img
                width:100%
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

