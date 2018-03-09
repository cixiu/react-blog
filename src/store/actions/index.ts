import * as types from '../actionTypes'

export const addCount = (count = 1) => ({
  type: types.COUNT,
  count
})
