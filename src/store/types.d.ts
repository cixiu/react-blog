import { LocationState } from 'redux-first-router'
interface ICategory {
  title: string
}

export interface IArticleDetail {
  category: ICategory[]
  title: string
  screenshot: string
  content?: string
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

export interface ISubComment {
  content: string
  createAt: number
  id: number
  likedUser: IUserInfo[]
  isLiked: boolean
  likesCount: number
  respComment: boolean
  respUserId: number
  respUserInfo: object
  topComment: any[]
  subCount: number
  updateAt: string
  userId: number
  userInfo: IUserInfo
}
export interface IComment extends ISubComment {
  subComments: ISubComment[]
}

export interface IStoreState {
  page: string
  hasMore: boolean
  isLoading: boolean
  articleList: IArticleDetail[]
  location: LocationState
  userId: number
  userInfo: IUserInfo
  articleDetail: IArticleDetail
}
