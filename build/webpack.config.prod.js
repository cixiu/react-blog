const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackMerge = require('webpack-merge')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const baseConfig = require('./webpack.config.base')
const config = require('../config')

const resolve = dir => path.join(__dirname, '..', dir)

const prodConfig = webpackMerge(baseConfig, {
  mode: 'production',
  devtool: config.build.devtool,
  // 入口文件
  entry: {
    app: ['babel-polyfill', resolve('src/client-entry.tsx')]
  },
  output: {
    filename: 'static/js/[name].[chunkhash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      favicon: resolve('favicon.ico'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new HtmlWebpackPlugin({
      template: 'ejs-compiled-loader!server-template.ejs',
      filename: 'server-template.ejs',
      inject: true
    }),
    // new ExtractTextPlugin('static/css/[name].[contenthash:8].css'),
    // 在编译时定义全局常量，开发环境下process.env.NODE_ENV = 'development'
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: JSON.stringify('production')
    //   }
    // }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //     comparisons: false
    //   },
    //   mangle: {
    //     safari10: true
    //   },
    //   output: {
    //     comments: false,
    //     ascii_only: true
    //   },
    //   sourceMap: config.build.productionSourceMap
    // }),
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor'
    // }),
    // // 消除weback运行打包时，vendor的hash的变化
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   minChunks: Infinity
    // }),
    new webpack.HashedModuleIdsPlugin(),
    // 以一个单独的进程来运行ts类型检查和lint来加快编译速度，配合ts-loader使用
    new ForkTsCheckerWebpackPlugin({
      async: false,
      watch: resolve('src'),
      tsconfig: resolve('tsconfig.json'),
      tslint: resolve('tslint.json')
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,  // 默认30000
      minChunks: 1,    // 默认1
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      // cacheGroups下的选项的配置继承上面的配置
      // test priority reuseExistingChunk则是cacheGroups独有的配置选项
      // cacheGroups.default.priority默认是负数
      // cacheGroups其他的定制cache groups默认是0
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        },
        commons: {
          // 使用node_modules下的第三方库被打包到vendors.js中作为缓存
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors'
        }
      }
    },
    runtimeChunk: false
  },
  // 某些第三方库使用了node原生的变量或者模块，但是在浏览器中并不会使用他们
  // 所以给这些变量或者模块提供一个空的对象，来让这些库正常运行
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
})

module.exports = prodConfig
