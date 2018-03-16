const express = require('express')
const axios = require('axios')

const router = express.Router()
// 后端接口地址
const baseUrl = 'http://127.0.0.1:3001'

// 代理登录接口将登录用户信息存入session中
router.post('/login', async (req, res, next) => {
  console.log(req.path)
  const url = `${baseUrl}/api/user/login`
  const data = req.body
  try {
    const response = await axios.post(url, data)
    // if  response.data.code === 0) {
    //   const userInfoRes = await axios.get(userInfoUrl)
    //   console.log(userInfoRes.data)
    console.log(response.data)
    if (response.data.code === 0) {
      console.log('done')
      req.session.userInfo = response.data.data
    }
    //   res.json(userInfoRes.data)
    // } else {
    console.log(req.session)
    res.json(response.data)
    // }
  } catch (err) {
    console.error(err)
    next(err)
  }
})

// router.get('/info', async (req, res, next) => {
//   const userInfoUrl = `${baseUrl}/api/user/info`
//   try {
//     const userInfoRes = await axios.get(userInfoUrl)
//     console.log(userInfoRes.data)
//     if (userInfoRes.data.code === 0) {
//       req.session.userInfo = userInfoRes.data
//     }
//     res.json(userInfoRes.data)
//   } catch (err) {
//     console.error(err)
//     next(err)
//   }
// })

module.exports = router
