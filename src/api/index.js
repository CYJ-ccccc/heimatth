// 封装所有跟主页相关的网络请求
// 导入封装好的axios实例
import instance from '../utils/httpToken'
import instance1 from '../utils/http'
// 封装获取用户频道区域的网络请求
export function getChannelsApi (params) {
  return instance({
    params,
    url: 'user/channels'
  })
}
export function getOneClassApi (params) {
  return instance1({
    params,
    url: 'http://192.168.188.200:5005/h5/nottoken/getSwipers',
    headers: {
      ContentType: 'X-WWW-FORM-URLENCODED'
    }
  })
}
// 封装获取全部频道区域的网络请求
export function getAllChannelsApi (params) {
  return instance({
    params,
    url: 'channels'
  })
}
// 封装获取刷新我的频道的网络请求
export function resetChannelsApi (channels) {
  return instance({
    method: 'PUT',
    data: {
      channels: channels
    },
    url: '/user/channels',
    headers: {
      ContentType: 'application/x-www-form-urlencoded'
    }
  })
}
// 封装获取指定频道文章列表的网络请求
export function getActicleApi (params) {
  return instance({
    params,
    url: 'http://ttapi.research.itcast.cn/app/v1_1/articles'
  })
}
// 封装对不感兴趣的文章作处理的网络请求
export function dislikeArtApi (data) {
  return instance({
    method: 'POST',
    url: 'article/dislikes',
    data
  })
}
// 封装举报文章作处理的网络请求
export function artReportsApi (data) {
  return instance({
    method: 'POST',
    url: 'article/reports',
    data
  })
}
// 封装拉黑作者作处理的网络请求
export function blackedApi (data) {
  return instance({
    method: 'POST',
    url: 'user/blacklists',
    data
  })
}
