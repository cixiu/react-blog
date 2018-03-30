import axios from 'axios'
const baseUrl = process.env.BASE_URL || ''

interface ICreateCommentParams {
  userId: number
  content: string
}

interface ILikeCommentParams {
  commentId: number
  userId: number
}

interface IReplyCommentParams {
  articleId: number
  userId: number
  respUserId: number
  commentId: number
  content: string
  isReply?: boolean
}

// 发表评论
export const createComment = async (
  articleId: number,
  data: ICreateCommentParams
) => {
  try {
    const res = await axios.post(
      `${baseUrl}/api/comments/${articleId}/create`,
      data
    )
    return Promise.resolve(res.data)
  } catch (err) {
    console.log(err)
  }
}

// 获取文章的评论列表
export const getArticleComments = async (articleId: number, userId: number) => {
  try {
    const res = await axios.get(`${baseUrl}/api/comments/${articleId}/list`, {
      params: { userId }
    })
    return Promise.resolve(res.data)
  } catch (err) {
    console.log(err)
  }
}

// 对评论点赞
export const likeComment = async (
  articleId: number,
  data: ILikeCommentParams
) => {
  try {
    const res = await axios.post(
      `${baseUrl}/api/comments/${articleId}/like`,
      data
    )
    return Promise.resolve(res.data)
  } catch (err) {
    console.log(err)
  }
}

// 回复评论
export const replyComment = async (data: IReplyCommentParams) => {
  const { articleId, userId, respUserId, commentId, content, isReply = false } = data
  try {
    const res = await axios.post(
      `${baseUrl}/api/comments/${articleId}/${commentId}/${userId}/reply/${respUserId}`,
      { content, isReply }
    )
    return Promise.resolve(res.data)
  } catch (err) {
    console.log(err)
  }
}
