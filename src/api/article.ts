import axios from 'axios'
const baseUrl = process.env.BASE_URL || ''

interface IGetArticleListParams {
  offset?: number
  limit?: number
  category?: string
  sort?: string
}

export const getArticleList = async ({
  offset = 0,
  limit = 10,
  category,
  sort
}: IGetArticleListParams) => {
  try {
    const res = await axios.get(`${baseUrl}/api/article/list`, {
      params: {
        offset,
        limit,
        category,
        sort
      }
    })
    return Promise.resolve(res.data)
  } catch (err) {
    console.log(err)
  }
}

export const getArticleDetail = async (id: number) => {
  try {
    const res = await axios.get(`${baseUrl}/api/article/detail`, {
      params: {
        id
      }
    })
    return Promise.resolve(res.data)
  } catch (err) {
    console.log(err)
  }
}
