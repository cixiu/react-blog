import * as React from 'react'
import { connect } from 'react-redux'
import { Location } from 'redux-first-router'
import Link, { NavLink, Match } from 'redux-first-router-link'
import {
  Layout,
  Row,
  Col,
  Button,
  Input,
  Icon,
  Tooltip,
  Dropdown,
  Menu,
  Avatar,
  message,
  notification
} from 'antd'
import { ClickParam } from 'antd/lib/menu'
import * as classNames from 'classnames/bind'
// import { debounce } from '../../common/ts/util'
import * as types from '../../store/actionTypes/routerTypes'
import { postLoginThunk, addUserId, addUserInfo } from '../../store/actions'
import { goToPage } from '../../store/actions/routerActions'
import { logout } from '../../api/user'
import { IStoreState } from '../../store/types'
import * as styles from './index.scss'

const logo = require('../../common/images/blog-logo.png')
const { Header } = Layout
const { Search } = Input
const cx = classNames.bind(styles)

interface IProps {
  changeProps: (flag: boolean) => void
}
interface IReduxInjectProps extends IProps {
  page: string
  location: IStoreState['location']
  userInfo: IStoreState['userInfo']
  postLoginThunk: (username: string, password: string) => any
  addUserId: (id: number) => void
  addUserInfo: (info: object) => void
  goToPage: (type: string, category?: string) => void
}

class MHeader extends React.Component<IProps, {}> {
  UserName!: HTMLInputElement | null
  Password!: HTMLInputElement | null
  scrollTop = 0
  isListenScroll = false

  state = {
    visible: false,
    loading: false,
    // isListenScroll: false,
    flag: false
  }

  get injected() {
    return this.props as IReduxInjectProps
  }

  // TODO:页面滚动到一定距离后，再向下滚，则header导航隐藏
  componentDidMount() {
    this.isListenScroll = true
    const scrollTop =
      document.body.scrollTop || document.documentElement.scrollTop
    if (scrollTop > 228) {
      this.scrollTop = scrollTop
      this.setState({ flag: true })
      this.props.changeProps(true)
    }
    this.listenScroll()
  }

  componentDidUpdate(prevProps: IReduxInjectProps) {
    // 如果切换了导航 重置this.scrollTop = 0
    if (this.injected.location.pathname !== prevProps.location.pathname) {
      this.scrollTop = 0
      this.setState({ flag: false })
      this.props.changeProps(false)
    }
    if (!this.isListenScroll) {
      this.isListenScroll = true
      this.listenScroll()
    }
  }

  // TODO:页面滚动到一定距离后，再向下滚，则header导航隐藏
  listenScroll = () => {
    window.addEventListener('scroll', () => {
      const scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop
      if (scrollTop > 228) {
        if (scrollTop > this.scrollTop) {
          this.setState({ flag: true })
          this.props.changeProps(true)
        } else {
          this.setState({ flag: false })
          this.props.changeProps(false)
        }
        this.scrollTop = scrollTop
      }
    })
  }

  // FIXME:首页高亮判断
  isActive = (match: Match<{}>, location: Location) => {
    // 如果页面的地址加载的是CATEGORY类型，则表示当前页面是首页
    return location.type === 'CATEGORY'
  }

  showModal = () => {
    this.setState({ visible: true })
  }

  closeLoginBox = () => {
    this.setState({ visible: false })
  }

  loginSubmit = async () => {
    const username = this.UserName ? this.UserName.value.trim() : ''
    const password = this.Password ? this.Password.value.trim() : ''
    if (!username) {
      message.error('用户名不能为空！')
    } else if (password.length < 6) {
      message.error('密码不能小于6位！')
    } else {
      this.setState({ loading: true })
      const res = await this.injected.postLoginThunk(username, password)
      if (res.code === 0) {
        message.success(res.message)
        this.setState({ visible: false, loading: false })
        // window.location.reload()
      } else {
        message.info(res.message)
        this.setState({ loading: false })
      }
    }
  }

  // TODO:搜索文章的功能
  search = (value: string) => {
    if (!value) {
      return
    }
    notification.info({
      message: '提示',
      description: '搜索功能暂未开放，敬请期待~~'
    })
  }
  // FIXME:登录后需要在顶部显示用户登录的信息
  handleDropdown = async ({ key, item, keyPath }: ClickParam) => {
    if (key === 'home') {
      this.injected.goToPage(types.CATEGORY, 'all')
    } else if (key === 'logout') {
      const res = await logout()
      if (res.code === 0) {
        this.injected.addUserId(0)
        this.injected.addUserInfo({})
        message.success(res.message)
      } else {
        message.error(res.message)
      }
    }
  }

  render() {
    return (
      <div className={styles.mainHeaderContainer}>
        <Header
          className={cx({
            miniHeader: true,
            visible: !this.state.flag
          })}
        >
          <header className={styles.innerContainer}>
            <Link to="/" className={styles.logo}>
              <img className={styles.logoImg} src={logo} alt="logo" />
            </Link>
            <Row type="flex" gutter={16} style={{ flex: 1 }}>
              <Col xs={8} sm={8} md={8} lg={8}>
                <NavLink
                  to="/"
                  style={{ display: 'flex', fontSize: '16px' }}
                  activeStyle={{ color: '#1890ff' }}
                  isActive={this.isActive}
                >
                  首页
                </NavLink>
              </Col>
              <Col
                xs={16}
                sm={16}
                md={16}
                lg={16}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end'
                }}
              >
                <Search
                  className={styles.search}
                  placeholder="搜索文章"
                  onSearch={value => this.search(value)}
                  size="large"
                />
                {!this.injected.userInfo.username ? (
                  <div className={styles.loginOrRegister}>
                    <span className={styles.login} onClick={this.showModal}>
                      登录
                    </span>
                    <span onClick={this.showModal}>注册</span>
                  </div>
                ) : (
                  <div style={{ marginRight: '1.5em' }}>
                    <Dropdown
                      overlay={
                        <Menu onClick={this.handleDropdown}>
                          <Menu.Item key="home">首页</Menu.Item>
                          <Menu.Item key="logout">退出登录</Menu.Item>
                        </Menu>
                      }
                    >
                      <Avatar icon="user" size="large" />
                    </Dropdown>
                  </div>
                )}
                <a
                  href="https://github.com/cixiu/react-blog"
                  target="_blank"
                  style={{ display: 'flex', flexShrink: 0 }}
                >
                  <Tooltip title="点击进入github" placement="bottomRight">
                    <Icon
                      type="github"
                      style={{
                        fontSize: 40
                      }}
                    />
                  </Tooltip>
                </a>
              </Col>
            </Row>
          </header>
        </Header>
        {this.state.visible && (
          <div className={styles.loginModalBox}>
            <div className={styles.loginBox}>
              <Icon
                type="close"
                className={styles.loginCloseIcon}
                onClick={this.closeLoginBox}
              />
              <div className={styles.loginPanel}>
                <h1 className={styles.title}>登录</h1>
                <ul className={styles.inputGroup}>
                  <li className={styles.inputBox}>
                    <input
                      className={styles.input}
                      name="registerUsername"
                      placeholder="请输入用户名"
                      maxLength={20}
                      ref={el => (this.UserName = el)}
                    />
                  </li>
                  <li className={styles.inputBox}>
                    <input
                      className={styles.input}
                      type="password"
                      name="registerPassword"
                      placeholder="请输入密码（不少于6位）"
                      maxLength={64}
                      ref={el => (this.Password = el)}
                    />
                  </li>
                </ul>
                <Button
                  className={styles.btnSubmit}
                  type="primary"
                  size="large"
                  loading={this.state.loading}
                  onClick={this.loginSubmit}
                >
                  {this.state.loading ? '登录中...' : '登录'}
                </Button>
                <p className={styles.tip}>没有注册，登录会自动注册！</p>
              </div>
            </div>
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

const mapDispatchToProps = {
  postLoginThunk,
  addUserId,
  addUserInfo,
  goToPage
}

const mergeProps = (
  stateProps: object,
  dispatchProps: object,
  ownProps: object
) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MHeader)
