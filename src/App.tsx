import * as React from 'react'
import { Route, Redirect, Link } from 'react-router-dom'
import { hot } from 'react-hot-loader'
// import universal from 'react-universal-component'
// import * as Loadable from 'react-loadable'

import Button from 'material-ui/Button'
import Reboot from 'material-ui/Reboot'
import About from './About'

// const UniversalComponent = universal(import('./About'))
// console.log(UniversalComponent)
// const UComponent = <UniversalComponent />
// interface IWebpackRequire extends NodeRequire {
//   resolveWeak(path: string): number
// }
// declare const require: IWebpackRequire

// console.log(1, [require.resolveWeak('./About')])

// const LoadableAbout = Loadable({
//   loader: () => import('./About'),
//   loading: () => null,
//   modules: ['./About'],
//   webpack: () => {
//     console.log(123)
//     return [require.resolveWeak('./About')]
//   },
// })

function Index() {
  return <h1>首页!!!</h1>
}

@hot(module)
class App extends React.Component {
  render() {
    return (
      <div>
        <Reboot />
        <h1>Hello World!!!</h1>
        <h2>你好!!!!</h2>
        <Link to="/about">关于我们</Link>
        <Button variant="raised" color="primary">
          primary
        </Button>
        <Button variant="raised" color="secondary">secondary</Button>
        <Route exact path="/" render={() => <Redirect to="/index" />} />
        <Route path="/index" component={Index} />
        <Route path="/about" component={About} />
      </div>
    )
  }
}

export default App
