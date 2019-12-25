<template><!--歌手的歌单列表组件--->
    <div class="song-list">
        <ul class="ul">
            <li v-for="(item,index) in song" :key="index" class="list">
                <div class="content">
                    <div class="listname">{{item.name}}</div>
                    <div class="listtext">{{item.singer}} · {{item.album}}</div>
                </div>
                
            </li>
        </ul>
    </div>
</template>
<script>
    export default{
        props:{
            song:Array
        }
    }
</script>
<style scoped lang="stylus">
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin"
    .list
        height: 64px
        align-items: center
        box-sizing: border-box
        font-size:$font-size-medium
        .listname
            no-wrap()
            color:$color-text
            line-height: 30px
        .listtext
            no-wrap()
            color:$color-text-d
                        
</style>
