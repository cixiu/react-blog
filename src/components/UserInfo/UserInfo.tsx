import * as React from 'react'
import { connect } from 'react-redux'
import { Avatar, Button, message, Modal } from 'antd'
import { logout } from '../../api/user'
import { addUserId, addUserInfo } from '../../store/actions'
import { IStoreState, IUserInfo } from '../../store/types'

import * as styles from './index.scss'

const confirm = Modal.confirm
interface IProps {}
interface IReduxInjectedProps extends IProps {
  userInfo: IUserInfo
  addUserId: (id: number) => void
  addUserInfo: (info: object) => void
}

class UserInfo extends React.Component<IProps, {}> {
  get injected() {
    return this.props as IReduxInjectedProps
  }

  logoutSubmit = async () => {
    confirm({
      title: '确定注销登录吗?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        const res = await logout()
        if (res.code === 0) {
          this.injected.addUserId(0)
          this.injected.addUserInfo({})
          message.success(res.message)
        } else {
          message.error(res.message)
        }
      }
    })
  }

  render() {
    return (
      <div className="aside-box">
        <div className={styles.userName}>
          <Avatar
            size="large"
            style={{
              color: '#fff',
              backgroundColor: '#1890ff',
              flex: '0 0 40px'
            }}
          >
            {this.injected.userInfo.username.substring(0, 1)}
          </Avatar>
          <ul className={styles.infoList}>
            <li>
              欢迎您，第
              <span style={{ color: '#ff4d4f' }}>
                {this.injected.userInfo.id}
              </span>
              位用户
            </li>
            <li style={{ color: '#ff4d4f' }}>
              {this.injected.userInfo.username}
            </li>
          </ul>
        </div>
        <div className={styles.userCreate}>
          注册时间: {this.injected.userInfo.create_time}
        </div>
        <div className={styles.userCreate}>
          注册地点: {this.injected.userInfo.create_address}
        </div>
        <Button
          type="danger"
          style={{ width: '100%' }}
          onClick={this.logoutSubmit}
        >
          注销登录
        </Button>
      </div>
    )
  }
}

const mapStateToProps = (state: IStoreState) => {
  return {
    userInfo: state.userInfo
  }
}

const mapDispatchToProps = { addUserId, addUserInfo }

const mergeProps = (
  stateProps: object,
  dispatchProps: object,
  ownProps: object
) => {
  return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(
  UserInfo
)
