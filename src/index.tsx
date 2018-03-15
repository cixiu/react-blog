import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'

import App from './App'
import configureStore from './store'
import './common/scss/rest.scss'
import './Interceptors'

interface IWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
  REDUX_STATE: object
}
declare const window: IWindow

const history = createHistory()
const initialState = window.REDUX_STATE

const { store } = configureStore(history, initialState)

ReactDOM.hydrate(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
