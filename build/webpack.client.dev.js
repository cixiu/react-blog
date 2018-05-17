const path = require('path')
const webpack = require('webpack')
const WriteFilePlugin = require('write-file-webpack-plugin')
const AutoDllPlugin = require('autodll-webpack-plugin')
const tsImportPluginFactory = require('ts-import-plugin')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const notifier = require('node-notifier')
const autoprefixer = require('autoprefixer')

const resolve = dir => {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  name: 'client',
  target: 'web',
  // devtool: 'source-map',
  devtool: 'eval-source-map',
  entry: {
    app: [
      'babel-polyfill',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false&quiet=true&noInfo=true',
      path.resolve(__dirname, '../src/index.tsx')
    ]
  },
  output: {
    filename: '[name].js',
    chunkFilename: 'js/[name].js',
    path: path.resolve(__dirname, '../dist/buildClient'),
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
                'syntax-dynamic-import',
                'transform-runtime'
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
        use: ExtractCssChunks.extract({
          use: {
            loader: 'css-loader'
          }
        })
      },
      {
        test: /\.(css|scss)$/,
        exclude: /node_modules/,
        use: ExtractCssChunks.extract([
          // fallback: 'style-loader',
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              importLoaders: 2,
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]',
              namedExport: true,
              camelCase: true,
              slient: true,
              minimize: process.env.NODE_ENV === 'production' ? true : false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9' // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009'
                })
              ]
            }
          },
          {
            loader: 'sass-loader'
          }
        ])
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
    // new WriteFilePlugin(), // 强制将打包在内存中的文件写入硬盘，便于查看打包的文件
    new ExtractCssChunks({
      filename: 'css/[name].css'
    }),
    new webpack.WatchIgnorePlugin([/scss\.d\.ts$/]),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
      filename: '[name].js',
      minChunks: Infinity
    }),

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`You application is running here http://localhost:8080`]
        // notes: ['Some additionnal notes to be displayed unpon successful compilation']
      },
      onErrors: (severity, errors) => {
        if (severity !== 'error') return
        const error = errors[0]
        notifier.notify({
          title: 'Webpack error',
          message: severity + ': ' + error.name,
          subtitle: error.file || '',
          icon: path.join(__dirname, 'notifier.png')
        })
      }
    }),
    // 以一个单独的进程来运行ts类型检查和lint来加快编译速度，配合ts-loader使用
    new ForkTsCheckerWebpackPlugin({
      async: false,
      watch: [resolve('src'), resolve('server')],
      tsconfig: resolve('tsconfig.json'),
      tslint: resolve('tslint.json')
    }),
    new AutoDllPlugin({
      context: path.join(__dirname, '..'),
      filename: '[name].js',
      entry: {
        vendor: [
          'react',
          'react-dom',
          'react-redux',
          'redux',
          'redux-thunk',
          'history/createBrowserHistory',
          'redux-first-router',
          'redux-first-router-link',
          'babel-polyfill',
          'redux-devtools-extension/developmentOnly',
          'classnames',
          'dateformat',
          'marked',
          'query-string',
          'react-content-loader',
          'react-helmet',
          'react-infinite-scroller',
          'simplemde'
        ]
      }
    })
  ]
}
