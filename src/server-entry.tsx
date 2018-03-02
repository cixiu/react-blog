import * as React from 'react'
import { StaticRouter as Router } from 'react-router-dom'
// import { Provider } from 'react-redux'
// import thunk from 'redux-thunk'
// import { SheetsRegistry } from 'react-jss/lib/jss'
// import * as Loadable from 'react-loadable'
import { createStore, compose, applyMiddleware, Store } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import JssProvider from 'react-jss/lib/JssProvider'
import { MuiThemeProvider } from 'material-ui/styles'
import rootReducers from './store/reducers'
import App from './App'

// interface IStyelInsertCss {
//   // [x: string]: string
//   _insertCss: () => void
// }

// const context = {
//   // Enables critical path CSS rendering
//   // https://github.com/kriasoft/isomorphic-style-loader
//   insertCss: (...styles: IStyelInsertCss[]) => {
//     // eslint-disable-next-line no-underscore-dangle
//     console.log(styles)
//     const removeCss = styles.map(x => x._insertCss())
//     console.log(removeCss)
//     return () => {
//       removeCss.forEach((f: any) => f())
//     }
//   }
// }

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
    return this.props.children
  }
}

export const getStore = (initialState: object): Store<object> => {
  return createStore(
    rootReducers,
    initialState,
    compose(applyMiddleware(thunk))
  )
}

export default (
  store: Store<object>,
  context: object,
  location: string | object,
  sheetsRegistry: any,
  generateClassName: any,
  theme: any,
  cssContext: any
) => {
  return (
    <Provider store={store}>
      <Router context={context} location={location}>
        <JssProvider
          registry={sheetsRegistry}
          generateClassName={generateClassName}
        >
          <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
            <StyleProvider context={cssContext}>
              <App />
            </StyleProvider>
          </MuiThemeProvider>
        </JssProvider>
      </Router>
    </Provider>
  )
}
