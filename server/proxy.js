const express = require('express')
const axios = require('axios')
axios.defaults.withCredentials = true

const router = express.Router()
// 后端接口地址
const baseUrl = 'http://127.0.0.1:3001'

// 代理登录接口将登录用户的userId存入cookie中
// 之后的请求在从cookie中取出userId，再发送请求获取用户信息
router.post('/login', async (req, res, next) => {
  const url = `${baseUrl}/api/user/login`
  const data = req.body
  try {
    const response = await axios.post(url, data)
    if (response.data.code === 0) {
      const userId = response.data.data.id
      res.cookie('userId', userId, {
        maxAge: 24 * 60 * 60 * 1000,
        signed: true
      })
      req.cookies.userId = userId
    }
    res.json(response.data)
  } catch (err) {
    console.error(err)
    // next(err)
  }
})

router.get('/logout', async (req, res, next) => {
  const url = `${baseUrl}/api/user/logout`
  try {
    const response = await axios.get(url)
    if (response.data.code === 0) {
      res.clearCookie('userId')
    }
    res.json(response.data)
  } catch (err) {
    console.error(err)
    // next(err)
  }
})

module.exports = router
