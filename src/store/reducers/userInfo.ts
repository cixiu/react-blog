import * as types from '../actionTypes'

interface IUserInfoAction {
  type: string
  info: object
}

const userInfo = (state = {}, action: IUserInfoAction) => {
  switch (action.type) {
    case types.USER_INFO:
      return action.info
    default:
      return state
  }
}

export default userInfo
