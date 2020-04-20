// 封装文章详情页的所有网络请求
import instance from '../utils/httpToken'
// 封装获取文章详情的网络请求
export function getActDetailApi (params) {
  return instance({
    url: `/articles/${params}`
  })
}
// 封装关注文章作者的网络请求
export function followAutApi (data) {
  return instance({
    method: 'POST',
    url: 'user/followings',
    data
  })
}
// 封装取消关注文章作者的网络请求
export function cancelFollowAutApi (data) {
  return instance({
    method: 'DELETE',
    url: `user/followings/${data}`,
    data
  })
}
