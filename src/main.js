import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入vant
import Vant from 'vant'
import 'vant/lib/index.css'
// 导入自己封装好的验证是否能登录组件
import IsLogin from './utils/plugin'
// 导入字体图标css
import './style/index.css'
// 导入dayjs
import dayjs from 'dayjs'
// 导入RelativeTime
import relativeTime from 'dayjs/plugin/relativeTime'
// 全局改变语言配置
// 导入中文语言包
import 'dayjs/locale/zh-cn'
// 使用relativeTime插件
dayjs.extend(relativeTime)
// 全局使用中文语言包to
dayjs.locale('zh-cn')
// 全局使用过滤器
Vue.filter('timeFilter', function (time) {
  return dayjs().to(dayjs(time))
})
// 使用Vant
Vue.use(Vant)
// 使用isLogin
Vue.use(IsLogin)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
