import createApp from './app'

// 客户端特定引导逻辑……

const {app, router, store} = createApp()
console.log(11111)

router.onReady(() => {
  console.log(222)
  const matchedComponents = router.getMatchedComponents()
  
  if (matchedComponents.length) {
    const asyncList = []
    matchedComponents.forEach(item => item.asyncData && asyncList.push(item.asyncData(store, router)))
    Promise.all(asyncList).then(() => {
      app.$mount('#app')
    })
  } else {
    app.$mount('#app')
  }
  router.beforeResolve((to, from, next) => {
    console.log(333)
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    
    console.log(matched, prevMatched)
    // 我们只关心非预渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    
    if (!activated.length) {
      return next()
    }
    Promise.all(activated.map(c => {
      if (c.asyncData) {
        return c.asyncData(store, to)
      }
    })).then(() => {
      next()
    }).catch(next)
  })
})
