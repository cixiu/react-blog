const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const notifier = require('node-notifier')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const webpackMerge = require('webpack-merge')
// const { ReactLoadablePlugin } = require('react-loadable/webpack')
const baseConfig = require('./webpack.config.base')
const config =require('../config')

const resolve = dir => {
  return path.join(__dirname, '..', dir)
}
const PORT = process.env.PORT || config.dev.port
const HOST = process.env.HOST || config.dev.host

module.exports = webpackMerge(baseConfig, {
  mode: 'development',
  devtool: config.dev.devtool,
  // 入口文件
  entry: [
    'babel-polyfill',
    // 'react-hot-loader/patch',
    path.join(__dirname, '..', 'src/client-entry.tsx')
  ],
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('index.html'),
      favicon: resolve('favicon.ico'),
      inject: true
    }),
    new HtmlWebpackPlugin({
      template: 'ejs-compiled-loader!server-template.ejs',
      filename: 'server-template.ejs',
      inject: true
    }),
    // new ReactLoadablePlugin({
    //   filename: `${config.build.assetsRoot}/react-loadable.json`,
    // }),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`You application is running here http://localhost:${PORT}`]
        // notes: ['Some additionnal notes to be displayed unpon successful compilation']
      },
      onErrors: (severity, errors) => {
        if (severity !== 'error') return
        const error = errors[0]
        notifier.notify({
          title: 'Webpack error',
          message: severity + ': ' + error.name,
          subtitle: error.file || '',
          icon: config.dev.ICON
        })
      }
    }),
    // // 在编译时定义全局常量，开发环境下process.env.NODE_ENV = 'development'
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     NODE_ENV: JSON.stringify('development')
    //   }
    // }),
    // // HMR(热更新)后显示正确的模块名字，在开发环境下使用较好
    // new webpack.NamedModulesPlugin(),
    // // 确保包括错误的资源都不会被emit
    // new webpack.NoEmitOnErrorsPlugin(),
    // 以一个单独的进程来运行ts类型检查和lint来加快编译速度，配合ts-loader使用
    new ForkTsCheckerWebpackPlugin({
      async: false,
      watch: resolve('src'),
      tsconfig: resolve('tsconfig.json'),
      tslint: resolve('tslint.json')
    })
  ],
  // 更多webpack-dev-server的详细信息 https://webpack.js.org/configuration/dev-server/
  devServer: {
    host: HOST,
    port: PORT,
    // 启用webpack的Hot Module Replacement(热更替)特性
    hot: true,
    // 启用gzip压缩生成的文件
    compress: true,
    // 服务启动成功后，是否自动打开浏览器
    open: config.dev.autoOpenBrowser,
    // 告诉服务器从哪里提供内容。
    // 如果文件目录下没有dist目录，则从内存中去dist目录
    // 默认是当前工作路径
    contentBase: config.build.assetsRoot,
    // contentBase:'/',
    // 与output的publicPath保持一致 此路径下的打包文件可在浏览器中访问。默认是'/'
    publicPath: config.dev.assetsPublicPath,
    // 使用HTML5 History API 解决在刷新路由报404的错误
    historyApiFallback: {
      index: config.dev.assetsPublicPath + 'index.html'
    },
    // 浏览器控制台打印相关的信息，可选的有none, error, warning or info (default).
    // 默认情况下，当reloading，error，HMR的时候都会显示相关信息在控制台
    // 这可能显得有点啰嗦，设置none可以关掉
    clientLogLevel: 'warning',
    // 当webpack编译错误时，在浏览器上加上遮盖层显示错误信息
    overlay: {
      errors: true
    },
    // 默认在console中(命令行中)显示webpack编译的过程，这个过程在console中过多
    // quiet=true可以隐藏掉编译的过程
    // 配合friendly-errors-webpack-plugin插件，则可以在编译失败的时候在consol中提示
    quiet: true,
    // webpack使用文件监控系统来监控文件改变，
    // 忽略node_modules文件，也不进行轮询
    watchOptions: {
      ignored: /node_modules/,
      poll: config.dev.poll
    },
    proxy: config.dev.proxyTable
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
