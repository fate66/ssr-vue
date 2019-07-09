const Koa = new require('koa')
const server = new Koa()
const {createBundleRenderer} = require('vue-server-renderer')
const koaStatic = require('koa-static')

const template = require('fs').readFileSync('./index.template.html', 'utf-8')

const createBundle = (serverBundle, clientManifest) => {
  return createBundleRenderer(serverBundle, {
    runInNewContext: false, // 推荐
    template,
    clientManifest
  })
}

let renderer = {}
process.env.NODE_ENV = process.argv[process.argv.length - 1]

if (process.env.NODE_ENV === 'production') {
  // 获取客户端、服务器端打包生成的json文件
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  // 赋值
  renderer = createBundle(serverBundle, clientManifest)
  
} else {
  const setupDevServer = require('./build/setup-dev-server')
  
  setupDevServer(server, (bundle, clientManifest) => {
    // 赋值
    renderer = createBundle(bundle, clientManifest)
  })
}
server.use(koaStatic(require('path').join(__dirname, './dist')))

server.use(async (ctx, next) => {
  
  // renderer.renderToString({title: '22'}, (err, html) => {
  //   if (err) {
  //     ctx.response.status = 500
  //     ctx.response.body = err
  //     return
  //   }
  //   console.log(html)
  //   // ctx.res.setHeader('Content-Type', 'text/html')
  //   ctx.response.body = 11
  // })
  // ctx.response.body = 1
  let res = await renderer.renderToString(ctx)
  console.log(res)
  
  ctx.response.body = res
})

server.listen(3000)
