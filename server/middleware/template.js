const axios = require('axios')
const config = require('../../config')

// 获取客户端模版代码
const getTemplate = async () => {
  const url = `http://localhost:${config.dev.port}${config.dev.assetsPublicPath}server-template.ejs`
  try {
    const res = await axios.get(url)
    return Promise.resolve(res.data)
  } catch (err) {
    console.log(err)
    return Promise.reject(err)
  }
}

module.exports = getTemplate
