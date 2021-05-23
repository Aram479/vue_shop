import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios"
import './plugins/element.js'
import 'assets/fonts/iconfont.css'
Vue.config.productionTip = false
axios.defaults.baseURL = "http://www.ysqorz.top:8888/api/private/v1/"

//接口请求拦截
axios.interceptors.request.use(config =>{
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
Vue.prototype.$http = axios
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
