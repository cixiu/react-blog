import { NOT_FOUND } from 'redux-first-router'
import * as types from '../actionTypes/routerTypes'

export const goToPage = (type: string, category?: string) => {
  return {
    type,
    payload: category && { category }
  }
}

export const goHome = () => ({
  type: types.HOME
})

export const goMovie = () => ({
  type: types.MOVIE
})

export const goMusic = () => ({
  type: types.MUSIC
})

// export const

export const notFound = () => ({
  type: NOT_FOUND
})
