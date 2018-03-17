import axios from 'axios'
const baseUrl = process.env.BASE_URL || ''

export const login = async (username: string, password: string) => {
  const url = `${baseUrl}/api/user/login`
  try {
    const res = await axios.post(url, {
      username,
      password
    })
    return Promise.resolve(res.data)
  } catch (err) {
    console.log(err)
  }
}

export const getUserInfo = async (userId: number) => {
  const url = `${baseUrl}/api/user/info`
  try {
    const res = await axios.get(url, {
      params: {
        user_id: userId
      }
    })
    return Promise.resolve(res.data)
  } catch (err) {
    console.log(err)
  }
}

export const logout = async () => {
  const url = `${baseUrl}/api/user/logout`
  try {
    const res = await axios.get(url)
    return Promise.resolve(res.data)
  } catch (err) {
    console.log(err)
  }
}
