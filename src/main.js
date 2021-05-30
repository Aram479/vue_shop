import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios"
import './plugins/element.js'
import 'assets/fonts/iconfont.css'
import TreeTable from "vue-table-with-tree-grid" //导入树形控件
Vue.config.productionTip = false
axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/"


Vue.component('tree-table', TreeTable) //安装树形控件
//接口请求拦截
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
Vue.prototype.$http = axios
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
