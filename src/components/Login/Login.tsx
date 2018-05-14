import * as React from 'react'
import { connect } from 'react-redux'
import { Button, message } from 'antd'
import * as styles from './index.scss'
import { postLoginThunk } from '../../store/actions'

interface IProps {}
interface IReduxInjectedProps extends IProps {
  postLoginThunk: (username: string, password: string) => any
}

class Login extends React.Component<IProps, {}> {
  UserName!: HTMLInputElement | null
  Password!: HTMLInputElement | null

  state = {
    loading: false
  }

  get injected() {
    return this.props as IReduxInjectedProps
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
      } else {
        message.info(res.message)
        this.setState({ loading: false })
      }
    }
  }

  render() {
    return (
      <div className="aside-box">
        <h3 className={styles.title}>辞修的个人博客</h3>
        <p className={styles.slogan}>一个记录个人学习经过的小站</p>
        <ul className="input-group">
          <li className={styles.inputBox}>
            <input
              className={styles.input}
              name="registerUsername"
              placeholder="用户名"
              maxLength={20}
              ref={el => (this.UserName = el)}
            />
          </li>
          <li className={styles.inputBox}>
            <input
              className={styles.input}
              type="password"
              name="registerPassword"
              placeholder="密码（不少于6位）"
              maxLength={64}
              ref={el => (this.Password = el)}
            />
          </li>
        </ul>
        <Button
          className={styles.btnSubmit}
          type="primary"
          loading={this.state.loading}
          onClick={this.loginSubmit}
        >
          {this.state.loading ? '登录中...' : '登录'}
        </Button>
        <p className={styles.tip}>没有注册，登录会自动注册！</p>
      </div>
    )
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

export default connect(null, mapDispatchToProps, mergeProps)(Login)
