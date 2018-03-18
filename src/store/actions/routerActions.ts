import { NOT_FOUND } from 'redux-first-router'
import * as types from '../actionTypes/routerTypes'

export const goToPage = (type: string, category?: string) => {
  return {
    type,
    payload: category ? { category } : {}
  }
}

export const goHome = () => ({
  type: types.HOME
})

export const goCategory = () => ({
  type: types.CATEGORY
})

export const goDetail = (id: number) => ({
  type: types.DETAIL,
  payload: { id }
})

// export const

export const notFound = () => ({
  type: NOT_FOUND
})
