import * as types from '../actionTypes'

interface IHasMoreAction {
  type: string
  flag: boolean
}

const hasMore = (state = true, action: IHasMoreAction) => {
  switch (action.type) {
    case types.HAS_MORE:
      return action.flag
    default:
      return state
  }
}

export default hasMore
