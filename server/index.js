require('babel-polyfill')
const express = require('express')
const favicon = require('serve-favicon')
const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackHotServerMiddleware = require('webpack-hot-server-middleware')
const clientConfig = require('../build/webpack.client.dev')
const serverConfig = require('../build/webpack.server.dev')

const DEV = process.env.NODE_ENV === 'development'
const publicPath = clientConfig.output.publicPath
const outputPath = clientConfig.output.path
const app = express()

app.use(favicon(path.join(__dirname, '../favicon.ico')))

if (DEV) {
  const multiCompiler = webpack([clientConfig, serverConfig])
  const clientCompiler = multiCompiler.compilers[0]

  app.use(
    webpackDevMiddleware(multiCompiler, {
      publicPath,
      logLevel: 'warn',
      stats: { colors: true }
    })
  )
  app.use(webpackHotMiddleware(clientCompiler))
  app.use(
    // keeps serverRender updated with arg: { clientStats, outputPath }
    webpackHotServerMiddleware(multiCompiler, {
      serverRendererOptions: { outputPath }
    })
  )
} else {
  const clientStats = require('../dist/buildClient/stats.json')
  const serverRender = require('../dist/buildServer/main.js').default

  app.use(publicPath, express.static(outputPath))
  app.use(serverRender({ clientStats, outputPath }))
}

app.listen(8080, () => {
  // console.log('Listening at http://localhost:8080')
})
