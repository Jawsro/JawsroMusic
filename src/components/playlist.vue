<template>
<!--player.vue引用-->
    <transition name="list-fade">
        <div class="playlist" v-show="showFlag" @click="hide">
            <div class="list-wrapper"  @click.stop>
                <div class="list-header">
                    <h1 class="title">
                        <img :src="iconMode" alt="" 
                            class="iconmode"
                            @click="changeMode">
                        <span class="text">{{modeText}}</span>
                        <span class="clear" @click.stop="showConfirm">
                            <i class="icon-clear"></i>
                            <img src="../assets/dustbin.png" alt="">
                        </span>
                    </h1>
                </div>
                <scroll class="list-content" 
                    :data="sequenceList"
                    ref="listcontent" 
                    :refreshDelay="refreshDelay">
                    <transition-group name="list" tag="ul">
                        <li class="item"
                            ref="listitem"
                            v-for="(item,index) in sequenceList"
                            :key="item.id"
                            @click="selectItem(item,index)">
                            <img :src="getCurrentSong(item)" alt="" 
                                class="current">
                            <span class="text" v-html="item.name"></span>
                            <span class="like" @click.stop="togoFavoriteImg(item)">
                                <img :src="getFavoriteImg(item)" alt="">
                            </span>
                            <span class="delete" @click.stop="deleteOne(item)">
                                <img src="../assets/dismiss.png" alt="">
                            </span>
                        </li>
                    </transition-group>
                </scroll>
                <div class="list-operate">
                    <div class="add" @click="addSong">
                        <img src="../assets/add.png" alt="" 
                            class="icon-add">
                        <span class="text">添加歌曲到列队</span>
                    </div>
                </div>
                <div class="list-close" @click="hide" >
                    <span>关闭</span>
                </div>
            </div>
            <confirm text="是否清空播放列表" 
                confirmBtnText="清空"
                ref="confirm"
                 @confirm="deleteAllconfirm" >
            </confirm>
            <add-song ref="addsong"></add-song>
        </div>
    </transition>
</template>
<script>
import Scroll from '../base/scroll/scroll'
import {mapActions} from "vuex"
import { playMode } from 'common/js/config'
import Confirm from '../base/confirm/confirm'
import { playerMixin } from 'common/js/mixin'
import AddSong from'../components/add-song'
export default{
    mixins:[playerMixin],
    // props:{
    //     sequenceList:Array,
    //     currentSong:Object,
    //     playlist:Array,
    //     mode:Number
    // },
    data(){
        return{
            showFlag:false,
            refreshDelay:120
        }
    },
    components:{
        Scroll,
        Confirm,
        AddSong
    },
    computed:{
        // ...mapGetters([
        //     'sequenceList',
        //     'currentSong',
        //     'playlist'
        // ])
        modeText(){
            return this.mode===playMode.sequence?'顺序播放': this.mode===playMode.loop?'单曲循环':'随机播放'
        }
    },
    methods:{
        // ...mapMutations({//playerMixin 中引用过来
        //     setCurrentIndex:'SET_CURRENT_INDEX',
        //     setPlayingState:'SET_PLAYING_STATE'
        // }),
       
        ...mapActions([
            'deleteSong',
            'deleteSongList'
        ]),
         deleteOne(item){
            //点击X删除该歌曲
            this.deleteSong(item)
            if(!this.playlist.length){
                this.hide()
            }
        },
        showConfirm(){
            this.$refs.confirm.show()
        },
        deleteAllconfirm(){
            this.deleteSongList()
            this.hide()
        },
        //封装的方法
        scrollCurrent(current){
            const index=this.sequenceList.findIndex((song)=>{
                return current.id==song.id
            })
            //scrollToElementg()滚动到第几个li元素，添加三百秒的动画
            this.$refs.listcontent.scrollToElement(this.$refs.listitem[index],300)
        },
        selectItem(item,index){
            //console.log(111)
            if(this.mode===playMode.random){
                index=this.playlist.findIndex((song)=>{
                    return song.id===item.id
                })
            }
            this.setCurrentIndex(index)
            this.setPlayingState(true)
        },
        getCurrentSong(item){
            //给播放的歌曲添加相应的图标
            if(this.currentSong.id===item.id){
                return require("../assets/stop.png")
            }
            return ""
        },
        show(){
            this.showFlag=true
            setTimeout(()=>{
                this.$refs.listcontent.refresh()
                 this.scrollCurrent(this.currentSong)
            },20)
        },
        hide(){
            this.showFlag=false
            //console.log(this.sequenceList)
        },
        addSong(){
            //console.log(11)
            this.$refs.addsong.show()
        }   
    },
    watch:{
        currentSong(newSong,oldSong){
            
            if(!this.showFlag || newSong.id===oldSong.id){
                return
            }
            this.scrollCurrent(newSong)
        }
    }

}
</script>
<style lang="stylus" scoped>
@import "~common/stylus/variable.styl"
@import "~common/stylus/mixin.styl"
.playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-banckground
      .list-header
        position: relative
        padding: 10px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .iconmode
            width:20px
            height:20px
          .text
            flex: 1
            margin-left:10px
            font-size: $font-size-medium-x
            color: $color-text-l
          .clear
            extend-click()
            img
              width:20px
              height:20px
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            height:20px
            margin-right:5px
            border:none
          img:not([src])
            opacity:0
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            img
              width:20px
              height:20px
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
            img
              width:20px
              height:20px
      .list-operate
        width: 140px
        margin: 20px auto 20px auto
        .add
          display: flex
          align-items: center
          padding: 8px 10px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            width:20px
            height:20px
            margin-right:5px
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 40px
        background: $color-banckground
        font-size: $font-size-medium-x
        color: $color-text-l
</style>