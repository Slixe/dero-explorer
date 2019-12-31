import VueRouter from 'vue-router';
import Vue from 'vue';
import Index from './views/Index.vue'
import Block from './views/Block.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', component: Index },
    { path: '/block/:id', component: Block},
   /* { path: '/tx/:hash', component: null }*/
  ];

export default new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
});