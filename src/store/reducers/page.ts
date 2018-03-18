import { NOT_FOUND } from 'redux-first-router'
import * as types from '../actionTypes/routerTypes'

interface IRouterAction {
  type: string
  payload?: object
}

// key: value 对应的是 一个路由对应一个路由组件
const routerComponents = {
  [types.HOME]: 'Category',
  [types.CATEGORY]: 'Category',
  [types.DETAIL]: 'Detail',
  [NOT_FOUND]: 'NotFound'
}

const page = (state = 'Category', action: IRouterAction) => {
  return routerComponents[action.type] || state
}

export default page
