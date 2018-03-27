import axios from 'axios'
const baseUrl = process.env.BASE_URL || ''

interface ICreateCommentParams {
  articleId: number
  userId: number
  content: string
}

export const createComment = async (data: ICreateCommentParams) => {
  try {
    const res = await axios.post(`${baseUrl}/api/comments/create`, data)
    return Promise.resolve(res.data)
  } catch (err) {
    console.log(err)
  }
}

export const getArticleComments = async (articleId: number) => {
  try {
    const res = await axios.get(`${baseUrl}/api/comments/list`, {
      params: { articleId }
    })
    return Promise.resolve(res.data)
  } catch (err) {
    console.log(err)
  }
}
