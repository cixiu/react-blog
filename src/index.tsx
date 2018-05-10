import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'

import App from './App'
import configureStore from './store'
import { IStoreState } from './store/types'
import './common/scss/rest.scss'
import './Interceptors'

interface IWindow extends Window {
  REDUX_STATE: IStoreState
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
