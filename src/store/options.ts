// import { redirect } from 'redux-first-router'
import * as queryString from 'query-string'
import { Dispatch } from 'react-redux'
// import { addUserInfo } from './actions'
// import { getUserInfo } from '../api/user'
import { IStoreState } from './types'

const options = {
  onBeforeChange: async (
    dispatch: Dispatch<any>,
    getState: () => IStoreState
  ) => {
    // 不能在onBeforeChange和onAfterChange中进行异步操作
    // 这可能会造成传一些异步数据还没有dispatch就将初始化的store传给了客户端
    // const state = getState()
    // if (state.userInfo.id) {
    //   return
    // }
    // if (state.userId) {
    //   const res = await getUserInfo(state.userId)
    //   console.log('1111')
    //   if (res.code === 0) {
    //     dispatch(addUserInfo(res.data))
    //   }
    // }
  },
  querySerializer: queryString,
  scrollTop: true
}

export default options
