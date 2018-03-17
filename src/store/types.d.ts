import { LocationState } from 'redux-first-router'
interface ICategory {
  _id: string
  title: string
}

export interface IArticleList {
  category: ICategory[]
  title: string
  screenshot: string
  content: string
  description: string
  author: string
  id: number
  create_time: string
  last_update_time: string
  views_count: number
  comment_count: number
}

export interface IUserInfo {
  username: string
  id: number
  avatar: string
  creatAt: number
  create_time: string
  create_address: string
}

export interface IStoreState {
  page: string
  hasMore: boolean
  isLoading: boolean
  articleList: IArticleList[] | any[]
  location: LocationState
  userId: number
  userInfo: IUserInfo
}
