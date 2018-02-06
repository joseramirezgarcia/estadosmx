<template>
  <div class="container">
    <div class="row">
      <div class="col col-md-4 offset-md-4 col-xs-12">
        <router-link
            class="btn btn-primary btn-lg btn-block" 
            title='Estudiar'
            to='/Estudiar'
            tag="button">
            Estudiar
        </router-link>
        <router-link
            class="btn btn-primary btn-lg btn-block" 
            title='Jugar'
            to='/Jugar'
            tag="button">
            Jugar
        </router-link>        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Inicio',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
