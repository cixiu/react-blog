const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const config = require('../config')

module.exports = webpackMerge(baseConfig, {
  mode: 'production',
  //在node.js编译环境中使用，不会把node的内置模块(如: fs, path...)等打包编译 默认是web
  target: 'node',
  entry: {
    app: path.join(__dirname, '..', 'src/server-entry.tsx')
  },
  // 所有的node_modules目录下的模块不打包进输出文件，需要用的直接require/import取即可
  externals: [nodeExternals()],
  output: {
    filename: 'server-bundle.js',
    // 以commonjs2的规范导出渲染函数
    // commonjs 规范只定义了exports，
    // 而 module.exports是nodejs对commonjs的实现，实现往往会在满足规范前提下作些扩展，我们这里把这种实现称为了commonjs2。
    // commonjs意味着单纯的CommonJs
    // commonjs2包括了module.exports.
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        API_BASE: JSON.stringify(`http://127.0.0.1:${config.server.port}`)
      }
    })
  ]
})
