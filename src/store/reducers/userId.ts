import * as types from '../actionTypes'

interface IUserIdAction {
  type: string
  id: number
}

const userId = (state = 0, action: IUserIdAction) =>
  action.type === types.USER_ID ? action.id : state

export default userId
