import VueRouter from 'vue-router';
import Vue from 'vue';

Vue.use(VueRouter)

const routes = [
    { path: '/', component: null },
    { path: '/block/:id', component: null},
    { path: '/tx/:hash', component: null }
  ];

export default new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
});