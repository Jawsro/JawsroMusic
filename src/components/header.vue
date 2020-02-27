<template>
    <!--app.vue引入-->
    <div class="header">
        <div class="icon"></div>
        <div class="text">Music</div>
        <router-link to="/user" 
            class="main" 
            tag="div"
        >
            <img src="../assets/user.png" alt="">    
        </router-link>
    </div>
</template>
<script>
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable.styl"
    .header
        text-align: center
        height: 44px
        position:relative
        color: $color-theme
        font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif
        .icon
            display:inline-block
            vertical-align :top
            margin-top:6px
            width:30px
            height:32px
            background:url("../assets/timg.png")
            background-size:30px 32px
        .text
            display:inline-block
            vertical-align :top
            line-height: 44px
            font-size: $font-size-large-x
        .main
            position:absolute
            right:12px
            top:12px
            img
                width:20px
                height:20px   
</style>
