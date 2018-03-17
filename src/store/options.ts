// import { redirect } from 'redux-first-router'
import * as queryString from 'query-string'
import { Dispatch } from 'react-redux'
import { addUserInfo } from './actions'
import { getUserInfo } from '../api/user'
import { IStoreState } from './types'

const options = {
  onBeforeChange: async (
    dispatch: Dispatch<any>,
    getState: () => IStoreState
  ) => {
    const state = getState()
    if (state.userInfo.id) {
      return
    }
    if (state.userId) {
      const res = await getUserInfo(state.userId)
      if (res.code === 0) {
        dispatch(addUserInfo(res.data))
      }
    }
  },
  querySerializer: queryString,
  scrollTop: true
}

export default options
