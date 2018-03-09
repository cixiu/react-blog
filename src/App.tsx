import { hot } from 'react-hot-loader'
import * as React from 'react'
// import Button from 'antd/lib/button'
// import 'antd/lib/button/style/index.css'
import { Button } from 'antd'
import Header from './components/Header/Header'
import Switch from './components/Switch/Switch'

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        Hello World!!!! <Button type="primary">antd</Button>
        <Switch />
      </div>
    )
  }
}

export default hot(module)(App)
