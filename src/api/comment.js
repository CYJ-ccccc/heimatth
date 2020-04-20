// 封装所有与评论相关的网络请求
import instance from '../utils/httpToken'
// 封装获取评论列表的网络请求
export function getCommentApi (params) {
  return instance({
    url: '/comments',
    params
  })
}
// 封装提交评论的网络请求
export function submitCommentApi (data) {
  return instance({
    url: '/comments',
    method: 'post',
    data
  })
}
// 封装获取回复评论的网络请求
export function getReplyCommentsApi (params) {
  return instance({
    url: '/comments',
    method: 'get',
    params
  })
}
// 封装回复评论的网络请求
export function replyCommentApi (data) {
  return instance({
    url: '/comments',
    method: 'post',
    data
  })
}
