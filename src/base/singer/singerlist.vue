<template>

    <scroll class="singer-container" 
            :data="data" 
            ref="listview"
            :linsten-scroll="linstenScroll"
            :probe-type="probeType"
            @scroll="scroll"
            >
        <div>
            <ul class="ul">
                <li v-for="(group,index) in data" 
                    :key="index" 
                    class="list-grounp" 
                    ref="listGrounp">
                    <div class="title">{{group.title}}</div>
                    <ul>
                        <li class="list" 
                            v-for="(item,index) in group.items" 
                            :key="index"
                            @click="selectitem(item)"
                            >
                            <div class="img">
                                <img v-lazy="item.url" alt="">
                            </div>
                            <div class="name">{{item.name}}</div>
                        </li>
                    </ul>

                </li>
            </ul>
        </div>
        
        <div class="alist" 
            @touchstart="onTouchstart"
            @touchmove.stop.prevent="onTouchmove"
            >
            <ul >
                <li v-for="(item,index) in list" 
                    :key="index" 
                    class="list"
                    :data-index="index"
                    :class="{'current':currentIndex===index}"
                    >
                    {{item}}
                </li>
            </ul>
        </div>
        <div class="fixed-title" v-show="fixedTitle" ref="fixed">
            <h1 class="title"> {{fixedTitle}}</h1>
        </div>
        <div class="loading-container" v-show="!data.length">
            <loading></loading>
        </div>
    </scroll>

</template>
<script>
import Scroll from '../scroll/scroll'
import Loading from '../loading/loading'
import {getData} from 'common/js/dom'

    const TITLE_HEIGHT = 30
    const ANCHOR_HEIGHT = 18

export default{
    components:{
        Scroll,
        Loading
    },
    data(){
        return{
            scrollY:-1,
            currentIndex:0,//当前显示的第几个
            diff:-1
        }
    },
    props:{
        data:{
            type:Array,
            default(){
                return []
            },
            
        },
        list:Array
    },
    computed:{
        fixedTitle(){
            if(this.scrollY>0){
                return ''
            }
            return this.data[this.currentIndex]? this.data[this.currentIndex].title:''
        }
    },
    created(){
        this.touch={}//不需要监听数据的变化，可以直接在creadted中定义
        this.linstenScroll=true
        this.listHeight=[]
        this.probeType=3
    },
    methods:{
        selectitem(item){
            //跳转到歌手详情列表
            this.$emit('select',item)
           //console.log(item)
        },
        onTouchstart(e){
            //在字母入口的事件  手指开始移动 的位置
            //console.log(e)
            let firsttouch=e.touches[0];//获取手指点击的位置
            
            let attributeIndex=getData(e.target,'index')
            this.touch.y1=firsttouch.pageY
            this.touch.attributeIndex=attributeIndex//记录一开始点击时字母的索引
             this._scrollTo(attributeIndex)
             console.log(attributeIndex,firsttouch.pageY)
        },
        onTouchmove(e){
            //在字母入口的事件  手指移动时
            let firsttouch=e.touches[0];//获取手指点击的位置
            this.touch.y2=firsttouch.pageY
            //获取是指移动的Y轴距离
            let dataA=(this.touch.y2-this.touch.y1)/ANCHOR_HEIGHT |0
            let attributeIndex =parseInt(this.touch.attributeIndex)+dataA
            console.log(attributeIndex,firsttouch.pageY)
            this._scrollTo(attributeIndex)
        },
         refresh () {
            this.$refs.listview.refresh()
        },
        scroll(pos){
            this.scrollY=pos.y
        },
        //封装方法
       
        _calculateHeight(){
            this.listHeight=[]
            const list=this.$refs.listGrounp
            //const list1=this.$refs.listview
            // console.log(list)
            let height=0
            this.listHeight.push(height)
            for(let i=0;i<list.length;i++){
                let item =list[i];
                height+=item.clientHeight
                this.listHeight.push(height)
                
            }
            //console.log(this.listHeight)
        },
         _scrollTo(index){
            
            if(!index && index!==0){
                return 
            }
            if(index<0){
                index=0
                
            }
            else if(index>this.listHeight.length-2){
                index=this.listHeight.length-2
            }
            //console.log(index,this.listHeight)
            this.scrollY=this.$refs.listview.scroll.y
            this.$refs.listview.scrollToElement(this.$refs.listGrounp[index],0)
        },
    },
    watch:{
        data(){
            setTimeout(()=>{
                this._calculateHeight()
            },20)
        },
        scrollY(newY){
            const listHeight=this.listHeight
            // 当滚动到顶部，newY>0
            if (newY > 0) {
                this.currentIndex = 0
                return
            }
            // 在中间部分滚动
            for (let i = 0; i < listHeight.length - 1; i++) {
                let height1 = listHeight[i]
                let height2 = listHeight[i + 1]
                if (-newY >= height1 && -newY < height2) {
                    this.currentIndex = i
                    this.diff = height2 + newY
                    return
                }
            }
            // 当滚动到底部，且-newY大于最后一个元素的上限
            this.currentIndex = listHeight.length - 2
        },
        diff(newval){
            let fixedTop=(newval>0&&newval<TITLE_HEIGHT)?newval-TITLE_HEIGHT:0
            if(this.fixedTop===fixedTop){
                return
            }
            this.fixedTop==fixedTop
            
            this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
        }
    },
    

}
</script>
<style scoped lang="stylus">
@import "~common/stylus/variable.styl"
    
        
        .singer-container
            position: relative
            width: 100%
            height:100%
            overflow: hidden
            .loading-container
                position:absolute
                width:100%
                top:50%
            .title
                background:$color-highlight-banckground
                color:$color-text-l  
                font-size:$font-size-small
                line-height:28px
                height:28px
                padding-left:30px
            .ul
                
                .list
                    display:flex
                    align-items:center
                    padding:10px 20px 10px 40px
                    .img 
                        flex:0 0 50px
                        width:50px
                        padding-right:30px
                        img 
                            width:100%
                            border-radius:50%
                    .name
                        flex:1
                        color:$color-text-l  
                        font-size:$font-size-medium
            .alist
                position:absolute
                top:50%
                transform:translateY(-50%)
                right:0
                width:20px
                font-size:$font-size-small
                color:$color-text-d 
                background:$color-banckground-d
                border-radius:20px
                padding:20px 0
                z-index:30
                .list
                    text-align:center
                    padding:3px
                    &.current
                        color: $color-theme
            .fixed-title
                position:absolute
                top:0
                left:0
                width:100%
                background:$color-highlight-banckground
                color:$color-text-l  
                font-size:$font-size-small
                line-height:28px
                height:28px
                z-index:99
</style>
