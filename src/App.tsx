import { hot } from 'react-hot-loader'
import * as React from 'react'
import { Layout } from 'antd'
import MHeader from './components/MHeader/MHeader'
import MContent from './components/MContent/MContent'

class App extends React.Component {
  render() {
    return (
      <Layout className="view-container" style={{ background: '#f5f5f5' }}>
        <MHeader />
        <MContent />
      </Layout>
    )
  }
}

export default hot(module)(App)
