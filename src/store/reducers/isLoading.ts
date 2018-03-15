import * as types from '../actionTypes'

interface IIsLoadingAction {
  type: string
  flag: boolean
}

const isLoading = (state = false, action: IIsLoadingAction) => {
  switch (action.type) {
    case types.IS_LOADING:
      return action.flag
    default:
      return state
  }
}

export default isLoading
