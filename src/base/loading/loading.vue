<template>
    <div class="loading">
       <img src="./loading.png" alt="">
       <p class="text">{{title}}</p>
    </div>
</template>
<script>
    export default{
        props:{
            title:{
                type:String,
                default:"正在加载中..."
            }
        }
    }
</script>
<style scoped lang="stylus">
@import "~common/stylus/variable.styl"
    .loading
        width:100%
        text-align:center
        img
            width:24px
            height:24px
        .text
            line-height:24px 
            color:$color-text-l
            font-size:$font-size-small
</style>
