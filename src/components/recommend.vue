<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-con" :data="gedanList">
      <div>
        <van-swipe :autoplay="3000">
          <van-swipe-item v-for="(image, index) in PicUrl" :key="index">
            <img v-lazy="image.picUrl" @load="loadImg()"/>
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
    
  </div> 
</template>
<script>
import Vue from 'vue';
import { Lazyload } from 'vant';
Vue.use(Lazyload);
import Scroll from '../base/scroll/scroll'
import Loading from '../base/loading/loading'
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
      // this.$router.push({
      //   path:`/recommend/${item.dissid}`
      // })
    },
    getList(){
      this.$ajax.get("http://ustbhuangyi.com/music/api/getDiscList?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&platform=yqq&hostUin=0&sin=0&ein=29&sortId=5&needNewCode=0&categoryId=10000000&rnd=0.7699859451579913")
      .then(res=>{
        //console.log(res.data.data.list)
        this.gedanList=res.data.data.list
      })
    },
    getPicUrl(){
      this.$ajax.get("http://ustbhuangyi.com/music/api/getTopBanner?g_tk=1928093487&inCharset=utf8&outCharset=utf-8&notice=0&format=json&platform=yqq.json&hostUin=0&needNewCode=0&-=recom8256750917833617&data=%7B%22comm%22:%7B%22ct%22:24%7D,%22category%22:%7B%22method%22:%22get_hot_category%22,%22param%22:%7B%22qq%22:%22%22%7D,%22module%22:%22music.web_category_svr%22%7D,%22recomPlaylist%22:%7B%22method%22:%22get_hot_recommend%22,%22param%22:%7B%22async%22:1,%22cmd%22:2%7D,%22module%22:%22playlist.HotRecommendServer%22%7D,%22playlist%22:%7B%22method%22:%22get_playlist_by_category%22,%22param%22:%7B%22id%22:8,%22curPage%22:1,%22size%22:40,%22order%22:5,%22titleid%22:8%7D,%22module%22:%22playlist.PlayListPlazaServer%22%7D,%22new_song%22:%7B%22module%22:%22newsong.NewSongServer%22,%22method%22:%22get_new_song_info%22,%22param%22:%7B%22type%22:5%7D%7D,%22new_album%22:%7B%22module%22:%22newalbum.NewAlbumServer%22,%22method%22:%22get_new_album_info%22,%22param%22:%7B%22area%22:1,%22sin%22:0,%22num%22:10%7D%7D,%22new_album_tag%22:%7B%22module%22:%22newalbum.NewAlbumServer%22,%22method%22:%22get_new_album_area%22,%22param%22:%7B%7D%7D,%22toplist%22:%7B%22module%22:%22musicToplist.ToplistInfoServer%22,%22method%22:%22GetAll%22,%22param%22:%7B%7D%7D,%22focus%22:%7B%22module%22:%22QQMusic.MusichallServer%22,%22method%22:%22GetFocus%22,%22param%22:%7B%7D%7D%7D")
      .then(res=>{
        //console.log(res.data.data.slider);
        this.PicUrl=res.data.data.slider
      })
    },
    loadImg(){
      if(!this.checkLoaded){
        this.$refs.scroll.refresh();
        this.checkLoaded=true
      }
    }
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
