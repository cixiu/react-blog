import * as React from 'react'
import { connect } from 'react-redux'
import Link /* { NavLink } */ from 'redux-first-router-link'
import { Layout, Row, Col, Button, Input, Icon } from 'antd'
import Login from '../Login/Login'
import { goToPage } from '../../store/actions/routerActions'
import { IStoreState } from '../../store/types'
import * as styles from './index.scss'

const logo = require('../../common/images/react.svg')
const { Header } = Layout
const { Search } = Input
// const SubMenu = Menu.SubMenu
// const Item = Menu.Item

interface IProps {}
interface IReduxInjectProps extends IProps {
  page: string
  location: IStoreState['location']
  userInfo: IStoreState['userInfo']
  goToPage: (type: string, category?: string) => void
}

class MHeader extends React.Component<IProps, {}> {
  state = {
    visible: false,
    navList: [
      { path: '/', text: '首页', exact: true },
      { path: '/movie', text: '电影' },
      { path: '/music', text: '音乐' },
      { path: '/category/html', text: 'HTML' },
      { path: '/category/css', text: 'CSS' },
      { path: '/category/javascript', text: 'Javascript' }
    ]
  }
  componentDidMount() {}

  get injected() {
    return this.props as IReduxInjectProps
  }

  showModal = () => {
    this.setState({
      visible: true
    })
  }

  render() {
    // const { navList } = this.state
    return (
      <div className={styles.mainHeaderContainer}>
        <Header className={styles.miniHeader}>
          <header className={styles.innerContainer}>
            <Link to="/" className={styles.logo}>
              <img className={styles.logoImg} src={logo} alt="logo" />
            </Link>
            <Row type="flex" gutter={16} style={{ flex: 1 }}>
              <Col xs={12} sm={8} md={8} lg={8}>
                <Link to="/">
                  <Button type="primary" size="large">
                    首页
                  </Button>
                </Link>
              </Col>
              <Col xs={0} sm={0} md={0} lg={8}>
                <Search
                  placeholder="搜索文章"
                  onSearch={value => console.log(value)}
                  enterButton
                  size="large"
                />
              </Col>
              <Col
                xs={12}
                sm={16}
                md={16}
                lg={8}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end'
                }}
              >
                {!this.injected.userInfo.username && (
                  <div className="login-or-register">
                    <Button
                      type="primary"
                      size="large"
                      onClick={this.showModal}
                    >
                      登录
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      onClick={this.showModal}
                    >
                      注册
                    </Button>
                  </div>
                )}
                <Button
                  type="primary"
                  href="https://github.com/cixiu/react-blog"
                  target="__blank"
                  size="large"
                  style={{ lineHeight: '48px', padding: 0 }}
                >
                  <Icon type="github" style={{ fontSize: 32 }} />
                </Button>
              </Col>
            </Row>
          </header>
        </Header>
        {this.state.visible && (
          <div className={styles.loginModalBox}>
            <Login />
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = ({ page, location, userInfo }: IStoreState) => {
  return {
    page,
    location,
    userInfo
  }
}

const mapDispatchToProps = { goToPage }

const mergeProps = (
  stateProps: object,
  dispatchProps: object,
  ownProps: object
) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MHeader)
