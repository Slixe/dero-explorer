import VueRouter from 'vue-router';
import Vue from 'vue';
import Index from './components/Index.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/', component: Index },
   /* { path: '/block/:id', component: null},
    { path: '/tx/:hash', component: null }*/
  ];

export default new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
});