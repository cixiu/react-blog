const path = require('path')
// 定义服务端渲染端口
const serverPort = 8081

module.exports = {
  dev: {
    // 路径
    assetsPublicPath: '/static/',
    // 代理
    proxyTable: {
      '/api': `http://localhost:${serverPort}`
    },
    // webpack-dev-server配置选择
    host: '0.0.0.0',
    port: 8080,
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false,
    // Source Maps
    devtool: 'eval-source-map',
    // 如何需要cssSourceMap,可以设置
    cssSourceMap: false,
    // 打包出错的配合node-notifier库和friendly-errors-webpack-plugin插件提示的icon
    ICON: path.join(__dirname, 'logo.png')
  },
  build: {
    // 路径
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsPublicPath: '/',
    // 生产环境使用sourceMap 在UglifyJsPlugin中可以配置
    productionSourceMap: true,
    devtool: '#source-map'
  },
  server: {
    // 服务端host和port
    host: '0.0.0.0',
    port: serverPort
  }
}
