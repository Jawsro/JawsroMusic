<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchbox" @query="queryChange"></search-box>
        </div>
        <div class="shortcut-wrapper" v-show="!query" ref="shortcutwrapper">
            <scroll class="shortcut"
                :data="shortcut"
                ref="shortcut"
                :refreshDelay="refreshDelay">
                <!-- scroll 效果只针对他的第一个元素，所以要体现滚动效果的元素要用div包裹起来-->
                <div>
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
                    <div class="search-history" v-show="searchHistory.length">
                        <h1 class="title">
                            <span class="text">搜索历史</span>
                            <span class="clear" @click="showConfirm">
                                <img src="../assets/dustbin.png" alt="" class="img-icon">
                            </span>
                        </h1>
                        <searchhistory-list 
                            :seraches="searchHistory"
                            @select="addQuery"
                            @delete="deleteOne">
                        </searchhistory-list>
                    </div>
                </div>
            </scroll>
        </div>
        <div class="search-result" v-show="query" ref="searchresult">
            <search-list 
                :query="query" 
                @listScroll="blurInput"
                @select="saveSearch"
                ref="searchlist">
            </search-list>
        </div>
        <confirm ref="confirm" 
            @confirm="deleteAll" 
            text="是否清空所有搜索历史" 
            confirmBtnText="清空">
        </confirm>
        <router-view />
    </div>
</template>
<script>
import Scroll from '../base/scroll/scroll'
import SearchBox from '../base/search-box/search-box'
import SearchhistoryList from '../base/search-list/search-list'
import Confirm from '../base/confirm/confirm'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import SearchList from"../components/searchlist"
import {mapGetters,mapActions} from 'vuex'
import { playlistMixin,searchMixin } from 'common/js/mixin'
export default{
    mixins:[playlistMixin,searchMixin],
    components:{
        SearchBox,
        SearchList,
        SearchhistoryList,
        Confirm,
        Scroll
    },
    data(){
        return{
            hotKey:[]
        }
    },
    computed:{
        shortcut(){
            return this.hotKey.concat(this.searchHistory)
        }
    },
    created(){
        this._getHotKey()
    },
    watch:{
        query(newQuery){
            if(!newQuery){
                setTimeout(()=>{
                    this.$refs.shortcut.refresh()
                },20)
            }
        }
    },
    methods:{
        ...mapActions([
            "clearSearchHistory"
        ]),
        handlePlaylist (playlist) {
            //底部迷你播放器的自适应
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.searchresult.style.bottom = bottom
            //调用refresh()该方法重新刷新一次
            this.$refs.searchlist.refresh()

            this.$refs.shortcutwrapper.style.bottom = bottom
            this.$refs.shortcut.refresh()
        },
        showConfirm(){
            this.$refs.confirm.show()
        },
        deleteAll(){
            this.clearSearchHistory()
        },
        deleteOne(item){
            this.deleteSearchHistory(item)
        },
        _getHotKey(){
            getHotKey().then((res)=>{
                if(res.code===ERR_OK){
                    //console.log(res.data.hotkey)
                    this.hotKey=res.data.hotkey.slice(0,15)
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
            .search-history
                position:relative
                margin:0 20px
                .title
                    display:flex
                    align-items:center
                    height:40px
                    font-size:$font-size-medium
                    color:$color-text-l
                    .text
                        flex:1
                    .clear
                        extend-click()
                        .img-icon
                            width:20px
                            height:20px
</style>
