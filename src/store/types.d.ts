import { LocationState } from 'redux-first-router'

export interface IStoreState {
  page: string
  count: number
  location: LocationState
}
