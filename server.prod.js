const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const favicon = require('serve-favicon')
const proxy = require('http-proxy-middleware')
const proxyUser = require('./server/proxy')
const clientConfig = require('./build/webpack.client.prod')

process.env.NODE_ENV ='production'
const publicPath = clientConfig.output.publicPath
const outputPath = clientConfig.output.path
const app = express()

app.use(favicon(path.join(__dirname, './favicon.ico')))
app.use(cookieParser('this is a blog writed by cixiu'))

app.use('/api', proxy({
  target: 'http://127.0.0.1:3001'
}))

// 因为http-proxy-middleware代理请求post请求时是不需要app.use(bodyParser.json())的
// 因此app.use(bodyParser.json())要在http-proxy-middleware之后使用 否则在post请求时会导致请求发送不出
app.use(bodyParser.json())
// 代理登录接口 存储cookie 保持登录状态
app.use('/user', proxyUser)

const clientStats = require('./dist/buildClient/stats.json')
const serverRender = require('./dist/buildServer/main.js').default

app.use(publicPath, express.static(outputPath))
app.use(serverRender({ clientStats, outputPath }))


app.listen(9000, () => {
  console.log('Listening at http://localhost:9000')
})
