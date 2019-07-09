const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.cfg')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const {resolve} = require('./utils')

module.exports = merge(baseConfig, {
  // 将 entry 指向应用程序的 server entry 文件
  entry: {
    index: './src/entry-server.js'
  },
  output: {
    // chunkhash是根据内容生成的hash, 易于缓存,
    // 开发环境不需要生成hash，目前先不考虑开发环境，后面详细介绍
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[id].[chunkhash].js',
    // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
    
    libraryTarget: 'commonjs2'
  },
  
  // 这允许 webpack 以 Node 适用方式(Node-appropriate fashion)处理动态导入(dynamic import)，
  // 并且还会在编译 Vue 组件时，
  // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
  target: 'node',
  // 对 bundle renderer 提供 source map 支持
  devtool: 'source-map',
  
  // https://webpack.js.org/configuration/externals/#function
  // https://github.com/liady/webpack-node-externals
  // 外置化应用程序依赖模块。可以使服务器构建速度更快，
  // 并生成较小的 bundle 文件。
  externals: nodeExternals({
    // 不要外置化 webpack 需要处理的依赖模块。
    // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
    // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
    whitelist: /\.css$/
  }),
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          // "style-loader",
          "css-loader",
          {
            loader: 'sass-loader',
            options: {
              // 你也可以从一个文件读取，例如 `variables.scss`
              data: `$color: red;`
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [
                require("autoprefixer")
                // require('postcss-pxtorem')({
                //   rootValue: 75,
                //   unitPrecision: 5,
                //   propList: ['*'],
                //   selectorBlackList: [],
                //   replace: true,
                //   mediaQuery: false,
                //   minPixelValue: 2
                // })
              ]
            }
          }
        ]
      }
    ]
  },
  
  // 这是将服务器的整个输出
  // 构建为单个 JSON 文件的插件。
  // 默认文件名为 `vue-ssr-server-bundle.json`
  plugins: [
    new VueSSRServerPlugin()
  ]
})
