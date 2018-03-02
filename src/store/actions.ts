import * as actions from './actionTypes'

export interface IAddCount {
  type: actions.ADD_COUNT
  count: number
}

export const addCount = (num: number): IAddCount => ({
  type: actions.ADD_COUNT,
  count: num
})
