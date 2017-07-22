<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import store from '@/store/index'
export default {
  name: 'app',
  store
}
</script>

<style>
html,body,#app{
  height: 100%;
  overflow: hidden;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
