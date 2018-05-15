import { hot } from 'react-hot-loader'
import * as React from 'react'
import { Layout } from 'antd'
import MHeader from './components/MHeader/MHeader'
import MContent from './components/MContent/MContent'

class App extends React.Component {
  state = {
    flag: false   // 用于控制分类导航栏的上滚和下滚
  }
  changeProps = (flag: boolean) => {
    this.setState({ flag })
  }
  render() {
    return (
      <Layout className="view-container" style={{ background: '#f5f5f5' }}>
        <MHeader changeProps={this.changeProps} />
        <MContent flag={this.state.flag}/>
      </Layout>
    )
  }
}

export default hot(module)(App)
