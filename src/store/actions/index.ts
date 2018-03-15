import * as types from '../actionTypes'

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
