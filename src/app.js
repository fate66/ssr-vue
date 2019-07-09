import Vue from 'vue'
import home from './home'
import createRouter from './router'
import {createStore} from './store'

export default function createApp(ctx) {
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    data: {},
    router,
    store,
    render: h => h(home)
  })
  return {app, router, store}
}
