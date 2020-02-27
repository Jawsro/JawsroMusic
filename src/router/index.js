import Vue from 'vue'
import Router from 'vue-router'
import Rank from '../../src/components/rank.vue'//排行
import Recommend from '../../src/components/recommend.vue'//推荐页面 默认
import Search from '../../src/components/search.vue'//搜索
import Singer from '../../src/components/singer.vue'//歌手
import SingerDetail from '../../src/components/singer-detail.vue'//歌手详情列表
import Dic from '../../src/components/dic.vue'//热门歌单子路由
import RankList from '../../src/components/rank-list.vue'//排行榜子路由
import UserCenter from '../../src/components/user-center.vue'//个人中心
Vue.use(Router)

export default new Router({
  routes: [
    {//推荐页面默认
      path: '/',
      redirect: '/recommend'
    },
    {//排行
      path: '/rank',
      component: Rank,
      children:[{
        path:":id",
        component:RankList
      }]
    },
    {//推荐
      path: '/recommend',
      component: Recommend,
      children:[{
        path:':id',
        component:Dic
      }]
    },
    {//搜索
      path: '/search',
      component: Search,
      children:[//子路由
        {//歌手详情列表
          path:':id',
          component:SingerDetail
        }
      ]
    },
    {//歌手
      path: '/singer',
      component: Singer,
      children:[//子路由
        {//歌手详情列表
          path:':id',
          component:SingerDetail
        }
      ]
    },
    {
      path:'/user',
      component:UserCenter
    }
  ]
})
