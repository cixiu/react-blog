import * as types from '../actionTypes'

interface IArticleDetailAction {
  type: string
  info: object
}

const articleDetail = (state = {}, action: IArticleDetailAction) => {
  return action.type === types.ARTICLE_DETAIL ? action.info : state
}

export default articleDetail
