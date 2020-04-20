import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用来保存用户信息中的token
    // 当一进到页面时读取本地的token，如果没有则设置为空对象
    token: JSON.parse(window.localStorage.getItem('token')) || {}
  },
  mutations: {
    saveToken: function (state, payload) {
      // 将用户信息保存在state中
      state.token = payload
      // 将用户信息中的token保存在本地localStorage中
      window.localStorage.setItem('token', JSON.stringify(payload))
    }
  },
  actions: {
  },
  modules: {
  }
})
