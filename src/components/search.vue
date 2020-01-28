<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchbox" @query="queryChange"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query">
            <div class="shortcut">
                <div class="hot-key">
                    <h1 class="title">热门搜索</h1>
                    <ul>
                        <li class="item"
                            v-for="(item,index) in hotKey"
                            :key="index"
                            @click="addQuery(item.k)">
                            <span>
                                {{item.k}}
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="search-result" v-show="query">
            <search-list :query="query"></search-list>
        </div>
        <router-view />
    </div>
</template>
<script>
import SearchBox from '../base/search-box/search-box'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import SearchList from"../components/searchlist"
export default{
    components:{
        SearchBox,
       SearchList
    },
    data(){
        return{
            hotKey:[],
            query:""
        }
    },
    created(){
        this._getHotKey()
    },
    methods:{
        queryChange(query){
            this.query=query
        },
        //点击关键词，同步到搜素框
        //setQuery()  调用search-box.vue里面的方法
        addQuery(query){
            this.$refs.searchbox.setQuery(query)
            
        },
        _getHotKey(){
            getHotKey().then((res)=>{
                if(res.code===ERR_OK){
                    //console.log(res.data.hotkey)
                    this.hotKey=res.data.hotkey.slice(0,8)
                    //console.log(this.hotKey)
                }
            })
        }
    }
}
</script>
<style scoped lang="stylus">
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
    .search-result
        position: fixed
        width: 100%
        top: 178px
        bottom: 0
    .search-box-wrapper
        margin:20px
    .shortcut-wrapper
        position:fixed
        top:178px 
        bottom:0
        width:100%
        .shortcut
            height:100%
            overflow:hidden
            .hot-key
                margin:0 20px 20px
                .title
                    margin-bottom:20px 
                    font-size:$font-size-medium
                    color:$color-text-l
                .item
                    display:inline-block
                    padding:5px 10px
                    margin:0 20px 10px 0 
                    border-radius :6px
                    background:$color-highlight-banckground 
                    font-size:$font-size-medium
                    color:$color-text-d
</style>
