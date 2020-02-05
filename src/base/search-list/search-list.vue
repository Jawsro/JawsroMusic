<template>
<!-- 搜索历史的记录-->
    <div class="searchhistorylist" v-show="seraches.length">
        <transition-group name="list" tag="ul">
            <li class="search-item" 
                v-for="(item,index) in seraches"
                :key="item"
                @click="selectItem(item)">
                <span class="text">{{item}}</span>
                <span class="icon" @click.stop="deleteOne(item)">
                    <img src="../../assets/dismiss.png" alt="" class="img-icon">
                </span>
            </li>
        </transition-group >
    </div>
</template>
<script>
    export default{
        props:{
            seraches:{
                type:Array,
                default:[]
            }
        },
        methods:{
            selectItem(item){
                this.$emit("select",item)
            },
            deleteOne(item){
                  this.$emit("delete",item)
            }
        }
    }
</script>
<style scoped lang="stylus">
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.searchhistorylist
    .search-item
        display:flex
        align-items:center
        height:40px
        &.list-enter-active, &.list-leave-active
            transition: all 0.1s
        &.list-enter, &.list-leave-to
            height: 0
        .text
            flex:1
            font-size:$font-size-medium
            color:$color-text-d
        .icon
            extend-click()
            .img-icon
                width:20px
                height:20px
</style>