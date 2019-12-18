<template><!--// // -->
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive exclude="Gedanlist">
      <!--   exclude="Gedanlist"  name的值-->
      <router-view/>
    </keep-alive>
    
  </div>
</template>

<script>
import MHeader from '../src/components/header.vue'
import Tab from '../src/components/tab.vue'
export default {
  name: 'App',
  components: {
    MHeader,
    Tab
  }
}
</script>

<style>
</style>
