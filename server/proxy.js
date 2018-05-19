const express = require('express')
const axios = require('axios')
axios.defaults.withCredentials = true

const router = express.Router()
// 后端接口地址
let baseUrl = 'http://127.0.0.1:3001'
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'https://manage.tzpcc.cn'
}

// 代理登录接口将登录用户的userId存入cookie中
// 之后的请求在从cookie中取出userId，再发送请求获取用户信息
router.post('/login', async (req, res, next) => {
  // 配合nginx设置x-real-ip 可以获得真实的ip地址
  const ip =
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.ip ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress
  const url = `${baseUrl}/api/user/login`
  const data = req.body
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Remote-IP': ip
      }
    })
    if (response.data.code === 0) {
      const userId = response.data.data.id
      res.cookie('userId', userId, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
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
