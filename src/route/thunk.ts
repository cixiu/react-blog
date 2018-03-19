import { Dispatch } from 'react-redux'
import { IStoreState } from '../store/types'
import { getArticleList, getArticleDetail } from '../api/article'
import { LocationState } from 'redux-first-router'
import {
  addArticleList,
  changeHasMore,
  changeIsLoading,
  addArticleDetail
} from '../store/actions'

interface ILocation extends LocationState {
  payload: {
    category?: string
    id?: number
  }
  query?: {
    sort?: string
  }
}

export const thunkArticleList = async (
  dispatch: Dispatch<any>,
  getState: () => IStoreState
) => {
  const { location }: { location: ILocation } = getState()
  const offset = 0
  const limit = 10
  const startThunk = +new Date()
  dispatch(changeIsLoading(true))
  const res = await getArticleList({
    offset,
    limit,
    category: location.payload.category,
    sort: location.query && location.query.sort
  })
  if (res.code === 0) {
    if (res.data.length < limit) {
      dispatch(changeHasMore(false))
    } else {
      dispatch(changeHasMore(true))
    }
    dispatch(addArticleList(res.data))
  } else {
    dispatch(addArticleList())
  }
  const endThunk = +new Date()
  console.log('数据初始化用时:' + (endThunk - startThunk) + 'ms')
  dispatch(changeIsLoading(false))
}

export const thunkArticleDetail = async (
  dispatch: Dispatch<any>,
  getState: () => IStoreState
) => {
  const { location }: { location: ILocation } = getState()
  const startThunk = +new Date()
  dispatch(changeIsLoading(true))
  const res = location.payload.id && await getArticleDetail(location.payload.id)
  if (res.code === 0) {
    dispatch(addArticleDetail(res.data))
  } else {
    dispatch(addArticleDetail())
  }
  const endThunk = +new Date()
  console.log('数据初始化用时:' + (endThunk - startThunk) + 'ms')
  dispatch(changeIsLoading(false))
}
