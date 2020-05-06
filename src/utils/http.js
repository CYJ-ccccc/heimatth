// 封装普通axios实例
// 导入axios
import axios from 'axios'
// 创建一个axios实例
const instance = axios.create({
  // 设置基地址
  baseURL: 'http://ttapi.research.itcast.cn/app/v1_0',
  withCredentials: true
})
export default instance
