import * as types from '../actionTypes'

interface IArticleListAction {
  type: string
  list: object
}

const articleList = (state = [], action: IArticleListAction) => {
  switch (action.type) {
    case types.ARTICLE_LIST:
      return action.list
    default:
      return state
  }
}

export default articleList
