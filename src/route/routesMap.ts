import { redirect } from 'redux-first-router'
import * as types from '../store/actionTypes/routerTypes'
// import { Dispatch } from 'react-redux'
// import { IStoreState } from '../store/types'
import { thunkArticleList, thunkArticleDetail } from './thunk'
import { goToPage } from '../store/actions/routerActions'

const routesMap = {
  [types.HOME]: {
    path: '/',
    thunk: async (dispatch: any, getState: any) => {
      dispatch(redirect(goToPage(types.CATEGORY, 'all')))
    }
  },
  [types.CATEGORY]: {
    path: '/category/:category',
    thunk: thunkArticleList
  },
  [types.DETAIL]: {
    path: '/detail/:id',
    thunk: thunkArticleDetail
  }
}

export default routesMap
