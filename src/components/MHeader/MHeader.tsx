import * as React from 'react'
import { connect } from 'react-redux'
import Link from 'redux-first-router-link'
import { Layout, Row, Col, Button, Input, Icon, message } from 'antd'
import { postLoginThunk } from '../../store/actions'
import { IStoreState } from '../../store/types'
import * as styles from './index.scss'

const logo = require('../../common/images/react.svg')
const { Header } = Layout
const { Search } = Input

interface IProps {}
interface IReduxInjectProps extends IProps {
  page: string
  location: IStoreState['location']
  userInfo: IStoreState['userInfo']
  postLoginThunk: (username: string, password: string) => any
}

class MHeader extends React.Component<IProps, {}> {
  UserName: HTMLInputElement | null = null
  Password: HTMLInputElement | null = null

  state = {
    visible: false,
    loading: false
  }
  componentDidMount() {}

  get injected() {
    return this.props as IReduxInjectProps
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
        this.setState({ visible: false })
      } else {
        message.info(res.message)
        this.setState({ loading: false })
      }
    }
  }

  render() {
    return (
      <div className={styles.mainHeaderContainer}>
        <Header className={styles.miniHeader}>
          <header className={styles.innerContainer}>
            <Link to="/" className={styles.logo}>
              <img className={styles.logoImg} src={logo} alt="logo" />
            </Link>
            <Row type="flex" gutter={16} style={{ flex: 1 }}>
              <Col xs={8} sm={8} md={8} lg={8}>
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
                xs={16}
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

const mapDispatchToProps = { postLoginThunk }

const mergeProps = (
  stateProps: object,
  dispatchProps: object,
  ownProps: object
) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(MHeader)
