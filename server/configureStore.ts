import createHistory from 'history/createMemoryHistory'
import { NOT_FOUND, LocationState } from 'redux-first-router'

import { Request, Response } from 'express'

import configureStore from '../src/store'
import { IStoreState } from '../src/store/types'

const doesRedirect = ({ kind, pathname }: LocationState, res: Response) => {
  if (kind === 'redirect') {
    res.redirect(302, pathname)
    return true
  }
  return false
}

interface IState {
  location: LocationState
}

export default async (req: Request, res: Response) => {
  const userId = Number(req.signedCookies.userId)
  console.log(userId)
  // 在onBeforeChange中使用userId来获取用户信息
  // 当然如果不使用onBeforeChange + userId,
  // 你也可以直接将用户信息直接传入cookie中，在从cookie中取出来 比如: req.signedCookies.userInfo
  const preLoadedState = { userId: userId ? userId : 0 } as IStoreState

  const history = createHistory({ initialEntries: [req.originalUrl] })
  const { store, thunk } = configureStore(history, preLoadedState)

  let location = (store.getState() as IStoreState).location
  if (doesRedirect(location, res)) {
    return false
  }

  // using redux-thunk perhaps request and dispatch some app-wide state as well, e.g:
  // await Promise.all([store.dispatch(myThunkA), store.dispatch(myThunkB)])

  await thunk(store) // THE PAYOFF BABY!

  location = (store.getState() as IStoreState).location // remember: state has now changed
  if (doesRedirect(location, res)) {
    return false
  } // only do this again if ur thunks have redirects

  const status = location.type === NOT_FOUND ? 404 : 200
  res.status(status)
  return store
}
