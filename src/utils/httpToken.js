// 封装携带拦截器的axios实例
// 导入axios
import axios from 'axios'
// 导入jsonBigint
import JSONbig from 'json-bigint'
// 导入获取token的方法
import store from '../store/index'
// 创建一个axios实例,这个实例要添加拦截器
const interceptor = axios.create({
  // 设置基地址
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0',
  // 全局设置axios请求允许携带cookie跨域
  //   withCredentials: true
  transformResponse: [function (data) {
    // Do whatever you want to transform the data
    try {
      return JSONbig.parse(data)
    } catch {
      return data
    }
  }]
})
// 重新创建一个axios实例
const instance = axios.create({
  // 设置基地址
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0'
})
// 请求拦截器
interceptor.interceptors.request.use(function (config) {
  // 在拦截器请求头中添加token
  // 获取保存在store的token
  var token = store.state.token.token
  // 判断是否存在token(是否登录)
  // window.console.log(token)
  token && (config.headers.Authorization = 'Bearer ' + token)
  return config
})
// 响应拦截器
interceptor.interceptors.response.use(
  // 响应成功的回调函数
  function (response) {
    return response
  },
  // 相应失败的回调函数
  async function (err) {
    // console.log(err)//打印不了err里面的属性
    console.dir(err)
    // 返回401表示token过期
    if (err.response.status === 401) {
      // 获取保存在本地的的refresh_token
      var refreshToken = store.state.token.refresh_token
      console.log(refreshToken)
      // 重新发送网络请求
      var res = await instance({
        url: '/authorizations',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      })
      window.console.log(res)
      // 获取返回的token
      var newToken = res.data.data.token
      // 在将新token保存在store中
      store.commit('saveToken', {
        token: newToken,
        refresh_token: refreshToken
      })
      // 重新发送未完成的请求，并且将接收到的结果返回给外界
      return interceptor(err.config)
    }
    return Promise.reject(err)
  })

export default interceptor
