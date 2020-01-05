<template><!--// // -->
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive >
      <!--   exclude="Gedanlist"  name的值-->
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from '../src/components/header.vue'
import Tab from '../src/components/tab.vue'
import Player from '../src/components/player.vue'
export default {
  name: 'App',
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style>
</style>
