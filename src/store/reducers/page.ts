import { NOT_FOUND } from 'redux-first-router'
import * as types from '../actionTypes/routerTypes'

interface IRouterAction {
  type: string
  payload?: object
}

// key: value 对应的是 一个路由对应一个路由组件
const routerComponents = {
  [types.HOME]: 'Home',
  [types.MOVIE]: 'Movie',
  [types.MUSIC]: 'Music',
  [types.CATEGORY]: 'Category',
  [NOT_FOUND]: 'NotFound'
}

const page = (state = 'Home', action: IRouterAction) => {
  return routerComponents[action.type] || state
}

export default page
