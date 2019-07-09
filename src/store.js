import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 假定我们有一个可以返回 Promise 的
// 通用 API（请忽略此 API 具体实现细节）

export function createStore() {
  return new Vuex.Store({
    state: {
      movie: {}
    },
    actions: {
      // 通过传入id请求电影数据，这里我们模拟一下，先返回id
      fetchMovie({commit}, id) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({id})
          }, 500)
        }).then(res => {
          commit('setMoive', {res})
        })
      }
    },
    mutations: {
      // 设置state
      setMoive(state, {res}) {
        state.movie = res
      }
    }
  })
}
