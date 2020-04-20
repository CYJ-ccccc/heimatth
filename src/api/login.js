// 封装所有登录相关的网络请求
// 导入封装好的axios实例
import instance from '../utils/httpToken'
// 封装登录提交的网络请求
export function loginApi (data) {
  return instance({
    method: 'post',
    data,
    url: '/authorizations'
  })
}
