const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const tsImportPluginFactory = require('ts-import-plugin')

const resolve = p => path.resolve(__dirname, p)

// if you're specifying externals to leave unbundled, you need to tell Webpack
// to still bundle `react-universal-component`, `webpack-flush-chunks` and
// `require-universal-module` so that they know they are running
// within Webpack and can properly make connections to client modules:
const externals = fs
  .readdirSync(resolve('../node_modules'))
  .filter(
    x =>
      !/\.bin|react-universal-component|require-universal-module|webpack-flush-chunks/.test(
        x
      )
  )
  .reduce((externals, mod) => {
    externals[mod] = `commonjs ${mod}`
    return externals
  }, {})

module.exports = {
  name: 'server',
  target: 'node',
  devtool: 'source-map',
  entry: [resolve('../server/render.tsx')],
  externals,
  output: {
    path: resolve('../dist/buildServer'),
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts', '.json'],
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        exclude: [resolve('node_modules')]
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: [resolve('node_modules')],
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: true,
              plugins: [
                'react-hot-loader/babel',
                "syntax-dynamic-import"
              ]
            }
          },
          {
            loader: 'ts-loader',
            options: {
              // ts-loader配合fork-ts-checker-webpack-plugin插件获取完全的类型检查来加快编译的速度
              transpileOnly: true,
              getCustomTransformers: () => ({
                before: [
                  tsImportPluginFactory({
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: 'css'
                  })
                ]
              })
            }
          }
        ]
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: {
          loader: 'css-loader/locals'
        }
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: {
          // 为了预渲染提取出来的css模块，应该使用css-loader/locals 而不是css-loader
          // 详细内容讲css-loader https://github.com/webpack-contrib/css-loader
          loader: 'css-loader/locals',
          options: {
            modules: true,
            localIdentName: '[name]__[local]--[hash:base64:5]',   // localIdentName格式必须与客户端的css-loader设置一样
            camelCase: true
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 4096,
          name: 'images/[name].[ext]?[hash]'
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BASE_URL: JSON.stringify('http://127.0.0.1:3001')
      }
    })
  ]
}
