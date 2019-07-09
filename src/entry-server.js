import createApp from './app'

export default function (ctx) {
  
  
  return new Promise((resolve, reject) => {
    const {app, router, store} = createApp()
    // 设置服务器端 router 的位置
    router.push(ctx.url)
    
    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      
      // 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject({code: 404})
      }
      const asyncList = []
      matchedComponents.forEach(item => item.asyncData && asyncList.push(item.asyncData(store, router)))
      Promise.all(asyncList).then(() => {
        ctx.state = store.state
        resolve(app)
      })
      // Promise 应该 resolve 应用程序实例，以便它可以渲染
    }, reject)
  })
}
