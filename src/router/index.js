import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('components/Login.vue')
const Home = () => import('components/Home.vue')
const Welcome = () => import('components/Welcome.vue')
const Users = () => import('components/users/Users.vue')
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/Login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})
//路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next() //如果当前路径为/login，则直接放行
  const tokenStr = window.sessionStorage.getItem('token') //获取token值
  if (!tokenStr) return next('/login') //若token没有值 则自动跳转到login页面
  next()//否则可以放行(进入home页面)
})
export default router
