import * as React from 'react'
import { connect } from 'react-redux'
import Login from '../Login/Login'
import UserInfo from '../UserInfo/UserInfo'
import * as styles from './index.scss'

import { IStoreState, IUserInfo } from '../../store/types'

interface IProps {}
interface IReduxInjectedProps extends IProps {
  userInfo: IUserInfo
}

class Aside extends React.Component<IProps, {}> {
  get injected() {
    return this.props as IReduxInjectedProps
  }

  render() {
    return (
      <aside className={styles.aside}>
        {this.injected.userInfo.username ? <UserInfo /> : <Login />}
        <div style={{ background: '#fff' }}>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
        </div>
      </aside>
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

export default connect(mapStateToProps, {}, mergeProps)(Aside)
