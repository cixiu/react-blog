const path = require('path')
const webpack = require('webpack')
const tsImportPluginFactory = require('ts-import-plugin')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const StatsPlugin = require('stats-webpack-plugin')
const AutoDllPlugin = require('autodll-webpack-plugin')
const autoprefixer = require('autoprefixer')

const resolve = (dir) => {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  name: 'client',
  target: 'web',
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    path.resolve(__dirname, '../src/index.tsx')
  ],
  output: {
    filename: '[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
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
          {
            loader: 'typings-for-css-modules-loader',
            options: {
              importLoaders: 2,
              modules: true,
              localIdentName: '[name]-[local]-[hash:base64:5]',
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
      }
    ]
  },
  plugins: [
    new StatsPlugin('stats.json'),
    new ExtractCssChunks({
      filename: 'css/[name].[contenthash:8].css'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
      filename: '[name].[chunkhash:8].js',
      minChunks: Infinity
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        screw_ie8: true,
        comments: false
      },
      sourceMap: true
    }),
    new webpack.HashedModuleIdsPlugin(), // not needed for strategy to work (just good practice)
    new AutoDllPlugin({
      context: path.join(__dirname, '..'),
      filename: '[name].js',
      entry: {
        vendor: [
          'react',
          'react-dom',
          'react-redux',
          'redux',
          'history/createBrowserHistory',
          'redux-first-router',
          'redux-first-router-link',
          'babel-polyfill',
          'redux-devtools-extension/developmentOnly'
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production')
          }
        }),

        new webpack.optimize.UglifyJsPlugin({
          compress: {
            screw_ie8: true,
            warnings: false
          },
          mangle: {
            screw_ie8: true
          },
          output: {
            screw_ie8: true,
            comments: false
          },
          sourceMap: true
        })
      ]
    })
  ]
}
