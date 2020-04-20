import Vue from 'vue'
// 导入路由
import VueRouter from 'vue-router'
// 导入组件
// 登录页
const Login = () => import('../views/login/index.vue')
// layout页
const Layout = () => import('../views/layout/index.vue')
// layout子路由
const Index = () => import('../views/index/index')
const Question = () => import('../views/question/index')
const Video = () => import('../views/video/index')
const My = () => import('../views/my/index')
// 导入搜索页
const Search = () => import('../views/search/index')
// 导入搜索页的子路由
const SearchResult = () => import('../views/searchResult/index.vue')
// 导入文章详情页
const Detail = () => import('../views/details/index.vue')
// 导入个人信息
const User = () => import('../views/user/index.vue')
// 导入小智同学
const Robot = () => import('../views/robot/index.vue')
// 使用路由
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [{
    path: '/login',
    component: Login
  },
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/checkLogin',
    component: Login
  },
  {
    path: '/search',
    component: Search
  },
  {
    path: '/searchResult',
    component: SearchResult
  },
  {
    path: '/detail',
    component: Detail
  },
  {
    path: '/user',
    component: User
  },
  {
    path: '/robot',
    component: Robot
  },
  {
    path: '/layout',
    component: Layout,
    children: [
      {
        path: '/',
        redirect: '/index'
      },
      {
        path: '/index',
        component: Index
      },
      {
        path: '/question',
        component: Question
      }, {
        path: '/video',
        component: Video
      },
      {
        path: '/my',
        component: My
      }
    ]
  }
  ]
})

export default router
