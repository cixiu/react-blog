import * as React from 'react'
import { connect } from 'react-redux'
import { Avatar } from 'antd'
import { IStoreState, IUserInfo } from '../../store/types'

import * as styles from './index.scss'

interface IProps {}
interface IReduxInjectedProps extends IProps {
  userInfo: IUserInfo
}
class UserInfo extends React.Component<IProps, {}> {
  get injected() {
    return this.props as IReduxInjectedProps
  }

  render() {
    return (
      <div className="aside-box">
        <div className={styles.userName}>
          <Avatar size="large" style={{ color: '#fff', backgroundColor: '#1890ff' }}>
            {this.injected.userInfo.username.substring(0, 1)}
          </Avatar>
          <ul className={styles.infoList}>
            <li>欢迎您，第<span style={{ color: '#ff4d4f' }}>{this.injected.userInfo.id}</span>位用户</li>
            <li style={{ color: '#ff4d4f' }}>{this.injected.userInfo.username}</li>
          </ul>
        </div>
        <div className={styles.userCreate}>注册时间: {this.injected.userInfo.create_time}</div>
        <div className={styles.userCreate}>注册地点: {this.injected.userInfo.create_address}</div>
      </div>
    )
  }
}

const mapStateToProps = (state: IStoreState) => {
  return {
    userInfo: state.userInfo
  }
}

const mergeProps = (
  stateProps: object,
  dispatchProps: object,
  ownProps: object
) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, {}, mergeProps)(UserInfo)
