import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import rootReducers from './store/reducers'
import App from './App'

interface IWindow extends Window {
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any
  __INITIAL_STATE__: object
}
declare const window: IWindow

const composeEnhancers =
  process.env.NODE_ENV === 'development'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose

const preloadState = window.__INITIAL_STATE__ || {}
const store = createStore(
  rootReducers,
  preloadState,
  composeEnhancers(applyMiddleware(thunk))
)

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

interface IStyelInsertCss {
  // [x: string]: string
  _insertCss: () => void
}

const context = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: (...styles: IStyelInsertCss[]) => {
    console.log(styles)
    const removeCss = styles.map(x => x._insertCss())
    console.log(removeCss)
    return () => {
      removeCss.forEach((f: any) => f())
    }
  }
}

interface IStyleProvider {
  context: {
    insertCss: () => void
  }
}

class StyleProvider extends React.Component<IStyleProvider, {}> {
  static childContextTypes =  {
    insertCss: () => {}
  }

  getChildContext() {
    return this.props.context
  }

  render() {
    // const { children, ...props } = this.props
    // return React.cloneElement(children, props)
    return this.props.children
  }
}

ReactDOM.hydrate(
  <Provider store={store}>
    <Router>
      <MuiThemeProvider theme={theme}>
        <StyleProvider context={context}>
          <App />
        </StyleProvider>
      </MuiThemeProvider>
    </Router>
  </Provider>,
  document.getElementById('root'),
  () => {
    const jssStyles = document.getElementById('jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
    const cssStyles = document.getElementById('css-server-side')
    if (cssStyles && cssStyles.parentNode) {
      cssStyles.parentNode.removeChild(cssStyles)
    }
  }
)
