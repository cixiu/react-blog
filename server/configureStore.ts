import createHistory from 'history/createMemoryHistory'
import { NOT_FOUND, LocationState } from 'redux-first-router'

import { Request, Response } from 'express'

import configureStore from '../src/store'

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
  const preLoadedState = {} // onBeforeChange will authenticate using this

  const history = createHistory({ initialEntries: [req.originalUrl] })
  const { store, thunk } = configureStore(history, preLoadedState)

  // if not using onBeforeChange + jwTokens, you can also async authenticate
  // here against your db (i.e. using req.cookies.sessionId)

  let location = (store.getState() as IState).location
  if (doesRedirect(location, res)) {
    return false
  }

  // using redux-thunk perhaps request and dispatch some app-wide state as well, e.g:
  // await Promise.all([store.dispatch(myThunkA), store.dispatch(myThunkB)])

  await thunk(store) // THE PAYOFF BABY!

  location = (store.getState() as IState).location // remember: state has now changed
  if (doesRedirect(location, res)) {
    return false
  } // only do this again if ur thunks have redirects

  const status = location.type === NOT_FOUND ? 404 : 200
  res.status(status)
  return store
}
