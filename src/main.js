// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'
import FastClick from 'fastclick'
import axios from "axios"
import VueLazyload from 'vue-lazyload'
import store from "./store"

FastClick.attach(document.body)
Vue.use(Vant)
Vue.config.productionTip = false

import 'common/stylus/index.styl'
Vue.prototype.$ajax = axios
Vue.use(VueLazyload, {
  preLoad: 1,
  loading: require('./assets/timg.png'),
  attempt: 2
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  store,
  
  template: '<App/>'
})
