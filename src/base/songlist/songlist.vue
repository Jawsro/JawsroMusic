<template><!--歌手的歌单列表组件--->
    <div class="song-list">
        <ul class="ul">
            <li @click="selectItem(item,index)" 
                v-for="(item,index) in song" 
                :key="index" class="list">
                <div class="rank" v-show="rank">
                    <span :class="getRankClc(index)" 
                            v-text="getRankText(index)"></span>
                </div>
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
            song:Array,
            rank:{
                type:Boolean,
                default:false
            }
        },
        methods:{
            selectItem(item,index){
                //向父组件gendanlist.vue传值，点击的歌曲和坐标
                this.$emit("select",item,index)
            },
            getRankClc(index){
                if(index<=2){
                    return `icon icon${index}`//class类名
                }else{
                    return 'text'//class类名
                }
            },
            getRankText(index){
                if(index>2){
                    return index+1
                }
            }
        }
    }
</script>
<style scoped lang="stylus">
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin"
    .list
        display:flex
        height: 64px
        align-items: center
        box-sizing: border-box
        font-size:$font-size-medium
        .rank
            flex:0 0 25px
            width:25px 
            margin-right:30px 
            text-align:center
            .icon
                display:inline-block
                width:25px 
                height:24px 
                background-size:25px 24px
                &.icon0
                    bg-image('first') 
                &.icon1
                    bg-image('second')
                &.icon2
                    bg-image('third')
            .text
                color: $color-theme
                font-size: $font-size-large
        .content
            flex: 1
            line-height: 20px
            overflow: hidden
            .listname
                no-wrap()
                color:$color-text
                line-height: 30px
            .listtext
                no-wrap()
                color:$color-text-d
                        
</style>
