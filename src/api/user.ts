import axios from 'axios'
const baseUrl = process.env.API_BASE || ''

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

export const getUserInfo = async () => {
  const url = `${baseUrl}/api/user/info`
  try {
    const res = await axios.get(url)
    return Promise.resolve(res.data)
  } catch (err) {
    console.log(err)
  }
}
