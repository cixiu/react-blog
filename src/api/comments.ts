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

export const createComment = async (articleId: number, data: ICreateCommentParams) => {
  try {
    const res = await axios.post(`${baseUrl}/api/comments/${articleId}/create`, data)
    return Promise.resolve(res.data)
  } catch (err) {
    console.log(err)
  }
}

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

export const likeComment = async (articleId: number, data: ILikeCommentParams) => {
  try {
    const res = await axios.post(`${baseUrl}/api/comments/${articleId}/like`, data)
    return Promise.resolve(res.data)
  } catch (err) {
    console.log(err)
  }
}
