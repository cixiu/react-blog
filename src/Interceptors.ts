import axios from 'axios'
import { notification } from 'antd'
axios.defaults.withCredentials = true

// 当网络状态好时，请求速度过快 导致数据请求时的要展示Loading会一闪而过
// 所以所有的请求都延迟100ms来查看路由跳转获取数据的Loading过渡效果
const fakeDelay = (ms = 100) => new Promise(res => setTimeout(res, ms))

// 拦截请求
axios.interceptors.request.use(
  async config => {
    return config
  },
  error => {
    console.log(error)
  }
)

// 拦截响应
axios.interceptors.response.use(
  async response => {
    await fakeDelay()
    return response
  },
  error => {
    const message = error.response
      ? `${error.response.status} ${error.response.statusText}`
      : error.message
    const description = error.response
      ? error.response.data
      : `Request has been terminated
    Possible causes: the network is offline,
    Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.`

    notification.error({
      message,
      description,
      duration: 10,
      style: {
        color: '#e33',
        background: '#f6e3e3'
      }
    })
    return Promise.reject(error)
  }
)
