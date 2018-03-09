import * as React from 'react'
import * as ReactDOMServer from 'react-dom/server'
import { Provider } from 'react-redux'
import Helmet from 'react-helmet'
import { flushChunkNames } from 'react-universal-component/server'
import flushChunks from 'webpack-flush-chunks'
// types
import { Store } from 'redux'
import { Stats } from 'webpack'
import { Request, Response } from 'express'

import configureStore from './configureStore'
import App from '../src/App'

const createApp = (store: Store<{}>) => (
  <Provider store={store}>
    <App />
  </Provider>
)

// 接收一个对象 {clientStats, serverStats, outputPath}
const serverRender = ({ clientStats }: {clientStats: Stats}) => async (req: Request, res: Response) => {
  const store = await configureStore(req, res)
  if (!store) {
    return
  } // no store means redirect was already served

  const app = createApp(store)
  const appString = ReactDOMServer.renderToString(app)
  const helmet = Helmet.renderStatic()
  const stateJson = JSON.stringify(store.getState())
  const chunkNames = flushChunkNames()
  const { js, styles, cssHash } = flushChunks(clientStats, { chunkNames })

  // console.log('请求地址:', req.path)
  // console.log('模块名称:', chunkNames)

  res.send(
    `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          ${helmet.title}
          ${styles}
        </head>
        <body>
          <script>window.REDUX_STATE = ${stateJson}</script>
          <div id="root">${appString}</div>
          ${cssHash}
          <script type='text/javascript' src='/static/vendor.js'></script>
          ${js}
        </body>
      </html>`
  )
}

export default serverRender
