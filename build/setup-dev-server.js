const fs = require('fs')
const path = require('path')
// memory-fs可以使webpack将文件写入到内存中，而不是写入到磁盘。
const MFS = require('memory-fs')
const webpack = require('webpack')
const clientConfig = require('./webpack.client.cfg')
const serverConfig = require('./webpack.server.cfg')
// webpack热加载需要
const webpackDevMiddleware = require('koa-webpack-dev-middleware')
// 配合热加载实现模块热替换
const webpackHotMiddleware = require('koa-webpack-hot-middleware')
const {resolve} = require('./utils')


module.exports = function setupDevServer(app, cb) {
  let bundle
  let clientManifest
  
  // 监听改变后更新函数
  const update = () => {
    if (bundle && clientManifest) {
      cb(bundle, clientManifest)
    }
  }
  
  // 修改webpack配合模块热替换使用
  clientConfig.entry.index = ['webpack-hot-middleware/client', clientConfig.entry.index]
  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(
      new webpack.HotModuleReplacementPlugin()
  )
  
  
  // 编译clinetWebpack 插入Koa中间件
  const clientCompiler = webpack(clientConfig)
  
  const devMiddleware = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true
  })
  
  // clientCompiler.watch({}, (err, stats) => {
  //   if (err) throw err
  //   console.log('--------')
  //   stats = stats.toJson()
  //   stats.errors.forEach(err => console.error(err))
  //   stats.warnings.forEach(err => console.warn(err))
  //   if (stats.errors.length) return
  //
  //   //  vue-ssr-webpack-plugin 生成的bundle
  //   // console.log(mfs.readFileSync(resolve('dist/vue-ssr-server-bundle.json'), 'utf-8'), '-0-')
  //   // bundle = JSON.parse(mfs.readFileSync(resolve('dist/vue-ssr-client-manifest.json'), 'utf-8'))
  //   // bundle = mfs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
  //   update()
  // })
  
  
  // serve webpack bundle output
  app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
  
  app.use(webpackHotMiddleware(clientCompiler))
  
  
  clientCompiler.plugin('done', stats => {
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    if (stats.errors.length) return
    
    // clientManifest = JSON.parse(readFile(
    //     devMiddleware.fileSystem,
    //     'vue-ssr-client-manifest.json'
    // ))
    clientManifest = JSON.parse(devMiddleware.fileSystem.readFileSync(resolve('dist/vue-ssr-client-manifest.json'), 'utf-8'))
    update()
  })
  
  //
  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    if (stats.errors.length) return
    
    //  vue-ssr-webpack-plugin 生成的bundle
    // console.log(mfs.readFileSync(resolve('dist/vue-ssr-server-bundle.json'), 'utf-8'), '-0-')
    bundle = JSON.parse(mfs.readFileSync(resolve('dist/vue-ssr-server-bundle.json'), 'utf-8'))
    // bundle = mfs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')
    update()
  })
}
