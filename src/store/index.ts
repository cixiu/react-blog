import { createStore, applyMiddleware, compose, combineReducers, StoreEnhancer } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { connectRoutes } from 'redux-first-router'
import { History } from 'history'

import routesMap from '../route/routesMap'
import * as reducers from './reducers'
import options from './options'
import { IStoreState } from './types'

const composeEnhancers = (...args: any[]): StoreEnhancer<IStoreState> => {
  return typeof window !== 'undefined'
    ? composeWithDevTools(...args)
    : compose(...args)
}

const configureStore = (history: History, initialState: IStoreState) => {
  const { reducer: location, middleware, enhancer, thunk } = connectRoutes(
    history,
    routesMap,
    options
  )

  const rootReducer = combineReducers<IStoreState>({ ...reducers, location })
  const middlewares = applyMiddleware(middleware, thunkMiddleware)
  const enhancers = composeEnhancers(enhancer, middlewares)
  const store = createStore<IStoreState>(rootReducer, initialState, enhancers)
  return { store, thunk }
}

export default configureStore
