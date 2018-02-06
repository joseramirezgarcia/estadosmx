// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

//firebase
import VueFire from 'vuefire';
Vue.use(VueFire);

import Chartkick from 'chartkick'
import VueChartkick from 'vue-chartkick'

Vue.use(VueChartkick, { Chartkick });

import VueRouter from 'vue-router'
Vue.use(VueRouter);

import Inicio from './components/Inicio';
import Estudiar from './components/Estudiar';
import Jugar from './components/Jugar';

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    {
      path:'/',
      component: Inicio
    },
    {
      path:'/Estudiar',
      component: Estudiar
    },
    {
      path:'/Jugar',
      component: Jugar
    }        
  ]
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  components: { App },
  template: '<App/>'
}).$mount('#app')
