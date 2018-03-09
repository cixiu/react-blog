const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const clientConfig = require('./build/webpack.client.dev')

process.env.NODE_ENV ='production'
const publicPath = clientConfig.output.publicPath
const outputPath = clientConfig.output.path
const app = express()

app.use(favicon(path.join(__dirname, './favicon.ico')))

const clientStats = require('./dist/buildClient/stats.json')
const serverRender = require('./dist/buildServer/main.js').default

app.use(publicPath, express.static(outputPath))
app.use(serverRender({ clientStats, outputPath }))


app.listen(9000, () => {
  console.log('Listening at http://localhost:9000')
})
