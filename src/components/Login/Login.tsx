import * as React from 'react'
import { Button } from 'antd'
import * as styles from './index.scss'

interface IProps {}

class Login extends React.Component<IProps, {}> {
  render() {
    return (
      <div className={styles.login}>
        <h3 className={styles.title}>辞修的个人博客</h3>
        <p className={styles.slogan}>一个记录个人学习经过的小站</p>
        <ul className="input-group">
          <li className={styles.inputBox}>
            <input
              className={styles.input}
              name="registerUsername"
              placeholder="用户名"
              maxLength={20}
            />
          </li>
          <li className={styles.inputBox}>
            <input
              className={styles.input}
              name="registerPassword"
              placeholder="密码（不少于6位）"
              maxLength={20}
            />
          </li>
        </ul>
        <Button className={styles.btnSubmit} type="primary">
          登录
        </Button>
        <p className={styles.tip}>没有注册，登录会自动注册！</p>
      </div>
    )
  }
}

export default Login
