import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        redirect: '/a'
      },
      {
        path: '/a',
        name: 'A',
        component: resolve => require(['./view/index'], resolve)
      },
      {
        path: '/b',
        name: 'B',
        component: resolve => require(['./view/index2'], resolve)
      },
    ]
  })
}
