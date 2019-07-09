'use strict'
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const utils = require('./utils')

// const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin

// const fileNameTransfer = fileName => fileName.match(/[A-Z][a-z]*/g).map((e) => e.toLowerCase()).join('-')
const env = process.env.NODE_ENV
module.exports = {
  mode: env,
  devtool: env === 'production' ? 'none' : 'inline-source-map',
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      // 'vue$': 'vue/dist/vue.esm.js',
      '@': utils.resolve('src'),
      'src': utils.resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: file => (
            /node_modules/.test(file) &&
            !/\.vue\.js/.test(file)
        ),
        use: {
          loader: 'babel-loader?cacheDirectory',
          options: {
            presets: ['@babel/preset-env']
            // plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'img/[name].[hash:7].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}

