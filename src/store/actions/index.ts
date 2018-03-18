import * as types from '../actionTypes'
import { login, getUserInfo } from '../../api/user'
import { Dispatch } from 'react-redux'
import { IStoreState } from '../types'

export const addArticleList = (list = []) => ({
  type: types.ARTICLE_LIST,
  list
})

export const changeHasMore = (flag: boolean) => ({
  type: types.HAS_MORE,
  flag
})

export const changeIsLoading = (flag: boolean) => ({
  type: types.IS_LOADING,
  flag
})

export const addUserId = (id: number) => ({
  type: types.USER_ID,
  id
})

export const addUserInfo = (info: object) => ({
  type: types.USER_INFO,
  info
})

export const postLoginThunk = (username: string, password: string) => async (
  dispatch: Dispatch<any>,
  getState: () => IStoreState
) => {
  try {
    const res = await login(username, password)
    if (res.code === 0) {
      dispatch(addUserId(res.data.id))
      dispatch(addUserInfo(res.data))
    }
    return Promise.resolve(res)
  } catch (err) {
    console.error(err)
  }
}

export const getUserInfoThunk = (userId: number) => async (
  dispatch: Dispatch<any>,
  getState: () => IStoreState
) => {
  try {
    const res = await getUserInfo(userId)
    if (res.code === 0) {
      dispatch(addUserInfo(res.data))
    }
    return Promise.resolve(res)
  } catch (err) {
    console.error(err)
  }
}
