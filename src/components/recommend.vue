<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-con" :data="gedanList">
      <div>
        <van-swipe :autoplay="3000">
          <van-swipe-item v-for="(image, index) in PicUrl" :key="index">
            <a :href="image.linkUrl">
              <img :src="image.picUrl" @load="loadImg()"/>
            </a>
          </van-swipe-item>
        </van-swipe>
        <div class="title">热门歌单推荐</div>
        <ul class="gedan">
          <li class="list" 
            v-for="(item,index) in gedanList" 
            :key="index"
            @click="gotoGedanlist(item)"
            >
            <div class="img">
              <img v-lazy="item.imgurl" alt="" :key="item.imgurl">
            </div>
            <div class="text">
              <p class="name">{{item.creator.name}}</p>
              <p class="basc">{{item.dissname}}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="loading-container" v-show="!gedanList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view/>
  </div> 
</template>
<script>
import Vue from 'vue';
import { Lazyload } from 'vant';
Vue.use(Lazyload);
import Scroll from '../base/scroll/scroll'
import Loading from '../base/loading/loading'
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { mapMutations } from 'vuex'
export default {
  data() {
      return {
        gedanList:[],//歌单列表
        PicUrl:[]//轮播图
      }
  },
  components:{
    Scroll,
    Loading
  },
  created(){
    this. getList();
    this.getPicUrl();
  },
  methods:{
    gotoGedanlist(item){
      console.log(item)
      this.$router.push({
        path:`/recommend/${item.dissid}`
      })
     this.setDisc(item)
    },
    getPicUrl(){
      // this.$ajax.get("http://ustbhuangyi.com/music/api/getDiscList?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&platform=yqq&hostUin=0&sin=0&ein=29&sortId=5&needNewCode=0&categoryId=10000000&rnd=0.7699859451579913")
      // .then(res=>{
      //   //console.log(res.data.data.list)
      //   this.gedanList=res.data.data.list
      // })
       getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            //console.log(res.data.slider)
            this.PicUrl = res.data.slider
          }
        })
    },
    getList(){
       getDiscList().then((res) => {
          if (res.code === ERR_OK) {
           this.gedanList = res.data.list
          }
        })
    },
    loadImg(){
      if(!this.checkLoaded){
        this.$refs.scroll.refresh();
        this.checkLoaded=true
      }
    },
     ...mapMutations({
        setDisc: 'SET_DISC'
      })
  }
}
</script>
<style scoped lang="stylus">
@import "~common/stylus/variable.styl"
  .recommend
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0
    .recommend-con
      height: 100%;
      overflow: hidden
      .loading-container
        position:absolute
        width:100%
        top:50%
        transform:translateY(-50%)
      .van-swipe
        width: 100%
        height: 150px
        img
          width: 100%
          height: 100%
      .title
        color: $color-theme
        font-size:$font-size-medium-x
        text-align: center
        margin-top: 20px
      .gedan
        margin-top:20px
        .list
          display:flex
          padding:0 20px 20px 20px
          align-items:center
          .img
            flex:0 0 60px
            width:60px
            padding-right:20px
            img 
              width:100%
          .name
            font-size:$font-size-medium
            color:$color-text
            margin-bottom:10px
          .basc
            color:$color-text-l  
            font-size:$font-size-small
</style>
