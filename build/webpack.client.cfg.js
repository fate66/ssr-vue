const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.cfg')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const {resolve} = require('./utils')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(baseConfig, {
  entry: {
    index: './src/entry-client.js'
  },
  output: {
    // chunkhash是根据内容生成的hash, 易于缓存,
    // 开发环境不需要生成hash，目前先不考虑开发环境，后面详细介绍
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[id].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          ...(process.env.NODE_ENV === 'production' ? [{
            loader: MiniCssExtractPlugin.loader,
            options: {}
          }] : ['style-loader']),
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
  plugins: [
    // 此录中插件在输出目
    // 生成 `vue-ssr-client-manifest.json`。
    new webpack.HashedModuleIdsPlugin(),
    new VueSSRClientPlugin(),
    new OptimizeCSSAssetsPlugin(),
    ...(process.env.NODE_ENV === 'production' ? [new MiniCssExtractPlugin({
      filename: 'static/css/[name].[chunkhash].css'
    })] : [])
  ]
})
