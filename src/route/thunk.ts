import { Dispatch } from 'react-redux'
import { IStoreState } from '../store/types'
import { getArticleList } from '../api/article'
import { LocationState } from 'redux-first-router'
import {
  addArticleList,
  changeHasMore,
  changeIsLoading
} from '../store/actions'

interface ILocation extends LocationState {
  payload: {
    category?: string
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
    dispatch(addArticleList([]))
  }
  const endThunk = +new Date()
  console.log('数据初始化用时:' + (endThunk - startThunk) + 'ms')
  dispatch(changeIsLoading(false))
  // setTimeout(() => {
  //   const endThunk = +new Date()
  //   console.log('用时:' + (endThunk - startThunk) + 'ms')
  //   dispatch(changeIsLoading(false))
  // }, 200)
}
