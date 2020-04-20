// 封装所有跟搜索有关的网络请求
import interceptor from '../utils/httpToken'
// 封装搜索框联想的网络请求
export function searchResultsApi (params) {
  return interceptor({
    url: '/search',
    params
  })
}
// 封装搜索框用户搜索历史的网络请求
export function gethistroiesApi (params) {
  return interceptor({
    url: 'search/histories',
    params
  })
}
// 封装搜索框联想的网络请求
export function suggestionApi (params) {
  return interceptor({
    url: '/suggestion',
    params
  })
}
// 封装删除用户搜索记录的网络请求
export function delHistroyApi () {
  return interceptor({
    method: ' DELETE',
    url: 'search/histories',
    headers: {
      ContentType: 'application/x-www-form-urlencoded'
    }
  })
}
