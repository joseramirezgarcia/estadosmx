<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Estudiar from './components/Estudiar'
import Jugar from './components/Estudiar'

import db from './Database'

export default {
  name: 'App',
  components: {
    Estudiar,
    Jugar
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 2%;
}
</style>
