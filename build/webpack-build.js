'use strict'
require('./check-versions')()
process.env.NODE_ENV = process.argv[process.argv.length - 1]
const ora = require('ora')
const chalk = require('chalk')
const webpack = require('webpack')
const execSync = require('child_process').execSync
const {resolve} = require('./utils')
execSync(`rm -rf ${resolve('dist')}`)
console.log('remove---dist')
const build = webpackCfg => {
  const spinner = ora('building...')
  spinner.start()
  webpack(webpackCfg, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')
    
    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }
    
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
    ))
  })
}

build(require('./webpack.server.cfg'))
build(require('./webpack.client.cfg'))


// const config = require('../config')
// let webpackConfig = {}
// switch (process.env.CMD) {
//   case config.baseENV.daily: {
//     console.log('--------------------测试环境开始打包-------------------')
//     webpackConfig = require('./webpack.daily.conf')
//     break
//   }
//   case config.baseENV.pre: {
//     console.log('--------------------预发环境开始打包-------------------')
//     webpackConfig = require('./webpack.pre.conf')
//     break
//   }
//   case config.baseENV.production: {
//     console.log('--------------------生产环境开始打包-------------------')
//     webpackConfig = require('./webpack.prod.conf')
//     break
//   }
//   case config.baseENV.analyz: {
//     console.log('--------------------生成包开始分析-------------------')
//     webpackConfig = require('./webpack.prod.conf')
//     const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
//     webpackConfig.plugins.push(new BundleAnalyzerPlugin(
//         {
//           analyzerMode: 'server',
//           analyzerHost: '127.0.0.1',
//           analyzerPort: 8889,
//           reportFilename: 'report.html',
//           defaultSizes: 'parsed',
//           openAnalyzer: true,
//           generateStatsFile: false,
//           statsFilename: 'stats.json',
//           statsOptions: null,
//           logLevel: 'info'
//         }
//     ))
//   }
// }
// webpack(webpackConfig, (err, stats) => {
//   if (err || stats.hasErrors()) {
//     // 在这里处理错误
//     console.log(err, '---')
//     console.log(stats, 'stats.hasErrors()')
//   }
//   // 处理完成
// });
// if (!webpackConfig.entry || !Object.keys(webpackConfig.entry).length) {
//   console.log(`clear-- ${utils.resolve('build')} has been removed`)
//   try {
//     let execSync = require('child_process').execSync
//     execSync(`rm -rf ${utils.resolve('build')}`)
//   } catch (e) {
//     console.error(e)
//   }
//   console.log('Build success')
//   return
// }

