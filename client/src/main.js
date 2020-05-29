import Vue from 'vue'
import App from './App.vue'
import router from './routes'
import 'babel-polyfill'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

Vue.use(require('babel-polyfill'))

new Vue({
  el: '#app',
  router,
  vuetify,
  render: h => h(App)
})