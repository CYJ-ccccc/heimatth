// 封装一个登录方法的插件
// 导入store
import store from '../store/index'
// 定义一个插件对象
var Plugin = {}
// 添加install方法
Plugin.install = function (Vue) {
  // Vue的构造器
  // 在vue中添加全局验证登录方法
  Vue.prototype.$isLogin = function () {
    // 得到用户的登录信息
    var token = store.state.token.token
    // 未登录返 回false
    if (!token) {
      return false
    } else { // 登录返回true
      return true
    }
  }
}
export default Plugin
