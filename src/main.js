import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// socket
import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
  debug: true, 
  connection: process.env.VUE_APP_SOCKET_SERVER,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}))

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
