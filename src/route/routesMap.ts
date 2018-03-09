import { addCount } from '../store/actions/index'
import * as types from '../store/actionTypes/routerTypes'

const routesMap = {
  [types.HOME]: {
    path: '/',
    thunk: async (dispatch: any, getState: any) => {
      const { count } = getState()
      if (count) {
        return
      }
      dispatch(addCount(10))
    }
  },
  [types.MOVIE]: '/movie',
  [types.MUSIC]: '/music',
  [types.CATEGORY]: {
    path: '/category/:category'
  },
}

export default routesMap
