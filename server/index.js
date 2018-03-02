const path = require('path')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const favicon = require('koa-favicon')
const Router = require('koa-router')
const proxy = require('koa-proxy')
const convert = require('koa-convert')
const MemoryFs = require('memory-fs')
const webpack = require('webpack')
const ReactDOMServer = require('react-dom/server')
const { SheetsRegistry } = require('react-jss/lib/jss')
const { createMuiTheme, createGenerateClassName } = require('material-ui/styles')
const asyncBootstrapper = require('react-async-bootstrapper').default
// const Loadable = require('react-loadable')
// const { getBundles } = require('react-loadable/webpack')
const serialize = require('serialize-javascript')
const ejs = require('ejs')
const serverConfig = require('../build/webpack.config.server')
const compileBundleString = require('./middleware/complie')
const getTemplate = require('./middleware/template')
const config = require('../config')

const router = new Router()
const app = new Koa()
const port = process.env.PORT || config.server.port
const host = process.env.HOST || config.server.host

app.keys = ['this is a personal blog website writed by cixiu']
const SESSION_CONFIG = {
  key: 'UID',
  maxAge: 30 * 24 * 60 * 60 * 1000,
  overwrite: true,
  signed: true
}
app.use(session(SESSION_CONFIG, app))
app.use(bodyParser())
app.use(favicon(path.join(__dirname, '../favicon.ico')))

let serverBundle
let getStore
const fs = new MemoryFs()
const serverComplier = webpack(serverConfig)
serverComplier.outputFileSystem = fs
serverComplier.watch(
  {
    ignored: /node_modules/
  },
  (err, stats) => {
    if (err) throw err
    const info = stats.toJson()
    // 编译错误
    if (stats.hasErrors()) {
      console.error(info.errors)
    }
    // 编译警告
    if (stats.hasWarnings()) {
      console.warn(info.warnings)
    }
    const bundleString = fs.readFileSync(
      path.join(serverConfig.output.path, serverConfig.output.filename),
      'utf8'
    )
    const bundle = compileBundleString(bundleString, 'server-bundle.js')
    serverBundle = bundle.exports.default
    getStore = bundle.exports.getStore
  }
)
// 代理公共路径下的资源
app.use(
  convert(
    proxy({
      host: `http://localhost:${config.dev.port}`,
      match: /^\/static\//
    })
  )
)

router.get('*', async (ctx, next) => {
  // 获取html模版
  const template = await getTemplate()
  console.log(ctx.url)
  const initialState = {}
  const store = getStore(initialState)
  const context = {}
  const location = ctx.url
  const sheetsRegistry = new SheetsRegistry()
  const generateClassName = createGenerateClassName()
  const theme = createMuiTheme({
    palette: {
      primary: {
        light: '#6ec6ff',
        main: '#2196f3',
        dark: '#0069c0',
        contrastText: '#fafafa'
      },
      secondary: {
        light: '#ffb2dd',
        main: '#ff80ab',
        dark: '#c94f7c',
        contrastText: '#fafafa'
      }
    }
  })
  const cssModule = new Set(); // CSS for all rendered React components
  const cssContext = { insertCss: (...styles) => styles.forEach(style => cssModule.add(style._getCss())) };

  const ReactNode = serverBundle(
    store,
    context,
    location,
    sheetsRegistry,
    generateClassName,
    theme,
    cssContext
  )
  await asyncBootstrapper(ReactNode)
  const appString = ReactDOMServer.renderToString(ReactNode)
  const newState = store.getState()
  const css = sheetsRegistry.toString()
  // Redirect重定向判定
  if (context.url) {
    ctx.status = 302
    ctx.set({
      Location: context.url
    })
  } else {
    const html = ejs.render(template, {
      appString,
      css,
      cssModule,
      initialState: serialize(newState),
    })
    ctx.body = html
  }
})
app.use(router.routes())
app.use(router.allowedMethods())


app.listen(port, host, () => {
  console.log(`Server is running at ${host}:${port}`)
})
