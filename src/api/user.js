// 封装所有有关用户信息的网络请求
import instance from '../utils/httpToken'
// 封装获取用户个人信息的网络请求1
export function getUserInfoApi1 () {
  return instance({
    url: '/user',
    method: 'get'
  })
}
// 封装获取用户个人信息的网络请求2
export function getUserInfoApi2 () {
  return instance({
    url: '/user/profile',
    method: 'get'
  })
}
// 封装修改用户个人信息的网络请求
export function reviseUserInfoApi (data) {
  return instance({
    url: '/user/profile',
    method: 'PATCH',
    data
  })
}
// 封装修改用户个人头像的网络请求
export function reviseUserIconApi (file) {
  // 创建一个FormData对象
  var fd = new FormData()
  // 添加参数
  fd.append('photo', file)
  return instance({
    url: '/user/photo',
    method: 'PATCH',
    data: fd
  })
}
