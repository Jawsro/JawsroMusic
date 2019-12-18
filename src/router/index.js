import Vue from 'vue'
import Router from 'vue-router'
import Rank from '../../src/components/rank.vue'//排行
import Recommend from '../../src/components/recommend.vue'//推荐页面 默认
import Search from '../../src/components/search.vue'//搜索
import Singer from '../../src/components/singer.vue'//歌手
import SingerDetail from '../../src/components/singer-detail.vue'//歌手详情列表
import Gedanlist from '../../src/components/gedanlist.vue'//歌单分类列表
Vue.use(Router)

export default new Router({
  routes: [
    {//推荐页面默认
      path: '/',
      redirect: '/recommend'
    },
    {//排行
      path: '/rank',
      component: Rank
    },
    {//推荐
      path: '/recommend',
      component: Recommend,
      children:[{
        path:':id',
        component:Gedanlist
      }]
    },
    {//搜索
      path: '/search',
      component: Search
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
    // {//歌单分类列表
    //   path: '/gedanlist/:id',
    //   component: Gedanlist
    // }
  ]
})
