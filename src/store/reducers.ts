import { combineReducers } from 'redux'
import { ADD_COUNT } from './actionTypes'
import { IAddCount } from './actions'

const count = (state = 0, action: IAddCount) => {
  switch (action.type) {
    case ADD_COUNT:
      return state + action.count
    default:
      return state
  }
}

export default combineReducers({
  count
})
