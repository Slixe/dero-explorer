import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

Vue.use(Vuetify)
new Vue({
  render: h => h(App),
  router,
  vuetify: new Vuetify({
    icons: {
      iconfont: 'md',
    },
    theme: {
      options: {
        customProperties: true,
      },
      themes: {
        dark: {
          primary: '#2A2D2F',
          secondary: '#383B3E',
          anchor: '#45484B',
        },
        light: {
          primary: '#DCDCDC',
          secondary: '#DCDCDC',
          anchor: '#BDBDBD',
        }
      },
      dark: true
    }
  }),
  
}).$mount('#app')
