<template>
<!-- 搜索框 公共组件-->
    <div class="search-box">
        <img src="../../assets/search.png" alt="" class="icon-search"/>
        <input type="text" class="box" 
            :placeholder="placeholder"
            v-model="query"
            ref="query">
        <img src="../../assets/dismiss.png"
             alt="" class="dismiss"
             v-show="query" @click="clear"/>
    </div>
</template>
<script>
import {debounce} from "common/js/utill"
export default {
    data(){
        return{
            query:""
        }
    },
    props:{
        placeholder:{
            type:String,
            default:"搜索歌曲、歌手"
        }
    },
    methods:{
        clear(){
            this.query=""
        },
        setQuery(query){
            this.query=query
        },
        blur(){
            this.$refs.query.blur()
        }
    },
    created(){
        //向外派发参数
        //debounce节流
        this.$watch("query",debounce((newQuery)=>{
            this.$emit("query",newQuery)
        },200))
    },
}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable.styl"
.search-box
    display:flex
    align-items:center
    box-sizing:border-box
    width:100%
    padding:0 6px
    height:40px
    background:$color-highlight-banckground
    border-radius:6px
    .icon-search
        width:24px
        height:24px
    .box
        flex:1
        outline: none
        border:none
        margin:0 5px
        line-height:18px
        background:$color-highlight-banckground
        color:$color-text
        font-size:$font-size-medium
        &::placeholder
           color:$color-text-d 
    .dismiss
        width:20px 
        height:20px
</style>