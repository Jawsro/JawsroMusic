<template>
    <div class="singer">
        <!-- <scroll class="singer-container" :data="SingerList">
            <div>
                <div class="title">热门歌手</div>
                <ul class="ul">
                    <li class="list" v-for="(item,index) in SingerList" :key="index">
                        <div class="img">
                            <img v-lazy="item.singer_pic" alt="">
                        </div>
                        <div class="name">{{item.singer_name}}</div>
                    </li>
                </ul>
            </div>
            <div class="loading-container" v-show="!SingerList.length">
                <loading></loading>
            </div>
            
        </scroll> -->
    <singer-view :data="SingerList" :list="list" @select="selectSinger"></singer-view>
    <router-view/>
    </div>
</template>
<script>
// import Scroll from '../base/scroll/scroll'
//import Loading from '../base/singer/singerlist'
import Singer from 'common/js/singer'
import SingerView from '../base/singer/singerlist'
import {mapMutations} from'vuex'
    const HOT_NAME="热门";
    const HOT_SINGER_LEN=10;

    export default{
        components:{
            // Scroll,
            // Loading
              SingerView
        },
        data(){
            return{
                SingerList:[],
                list:[]
            }
        },
        created(){
          this.getSingerList();
            this.getSingerlist();
        },
        methods:{
            selectSinger(item){
                this.$router.push({
                    path:`/singer/${item.id}`
                })
                this.setSinger(item)
            },
            getSingerList(){
                    this.$ajax.get(
                        "https://u.y.qq.com/cgi-bin/musicu.fcg?-=getUCGI5181040143076883&g_tk=238001699&loginUin=844399879&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%2C%22cv%22%3A0%7D%2C%22singerList%22%3A%7B%22module%22%3A%22Music.SingerListServer%22%2C%22method%22%3A%22get_singer_list%22%2C%22param%22%3A%7B%22area%22%3A-100%2C%22sex%22%3A-100%2C%22genre%22%3A-100%2C%22index%22%3A-100%2C%22sin%22%3A0%2C%22cur_page%22%3A1%7D%7D%7D")
                    .then(res=>{
                        //console.log(res.data.singerList.data)
                        //this.SingerList=res.data.singerList.data.singerlist
                    //this.list=res.data.singerList.data.tags.index
                        
                    })
            },
            getSingerlist(){
                    this.$ajax.get(
                        "https://c.y.qq.com/v8/fcg-bin/v8.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&hostUin=0&needNewCode=0&platform=yqq")
                    .then(res=>{
                        //console.log(res.data.data.list)
                        //console.log(this.geshoulist(res.data.data.list))
                        this.SingerList=this.geshoulist(res.data.data.list)
                        this.list = this.geshoulist(res.data.data.list).map((group) => {
                            return group.title.substr(0, 1)
                        })
                        //console.log( this.list)
                    })
            },
            geshoulist(list){
                let map={
                    hot:{
                        title:HOT_NAME,
                        items:[]
                    }
                }
                list.forEach((item,index)=>{
                    if(index<HOT_SINGER_LEN){
                        map.hot.items.push(
                        //        {
                        //        id:item.Fsinger_id,
                        //        url:`https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.Fsinger_mid}.jpg?max_age=2592000`,
                        //        name:item.Fsinger_name
                        //    }
                            new Singer({
                                id:item.Fsinger_mid,
                                name:item.Fsinger_name
                            })
                        )
                    }
                    const key =item.Findex
                    if(!map[key]){
                        map[key]={
                            title:key,
                            items:[]
                        }
                    }
                    map[key].items.push(new Singer({
                            id:item.Fsinger_mid,
                            name:item.Fsinger_name
                        }))
                })
                //为了得到有序列表，处理map
                let hot=[];
                let arr=[];
                for(let key in map){
                    let word=map[key]
                    if(word.title.match(/[a-zA-Z]/)){
                        arr.push(word)
                    }else if(word.title===HOT_NAME){
                        hot.push(word)
                    }
                }
                arr.sort((a,b)=>{
                    return a.title.charCodeAt(0)-b.title.charCodeAt(0)
                })
                //console.log(hot,arr)
                    return hot.concat(arr)
            },
            ...mapMutations({
                setSinger:'SET_SINGER'
            })
        }
    }
</script>
<style scoped lang="stylus">
.singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
