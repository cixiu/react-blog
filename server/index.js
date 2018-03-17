require('babel-polyfill')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const favicon = require('serve-favicon')
const path = require('path')
const webpack = require('webpack')
const proxy = require('http-proxy-middleware')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackHotServerMiddleware = require('webpack-hot-server-middleware')
const clientConfig = require('../build/webpack.client.dev')
const serverConfig = require('../build/webpack.server.dev')
const proxyUser = require('./proxy')

// const apiServerHost = 'http://127.0.0.1:3001'
// process.env.BASE_URL = apiServerHost
const DEV = process.env.NODE_ENV === 'development'
const publicPath = clientConfig.output.publicPath
const outputPath = clientConfig.output.path
const app = express()

app.use(favicon(path.join(__dirname, '../favicon.ico')))

app.use(bodyParser.json())
app.use(cookieParser('this is a blog writed by cixiu'))

// app.use(
//   session({
//     name: 'react-blog',
//     secret: 'this is a blog writed by cixiu',
//     resave: true,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: false,
//       maxAge: 24 * 60 * 60 * 1000 * 30 // 最大保存时间一天
//     }
//   })
// )

// 代理登录接口 存储session 保持登录状态
app.use('/api/user', proxyUser)

app.use('/api', proxy({
  target: 'http://localhost:3001'
}))

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
