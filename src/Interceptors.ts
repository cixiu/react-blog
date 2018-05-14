// import axios from 'axios'

// if (process.env.NODE_ENV === 'development') {
//   // 开发环境请求速度过快 导致数据请求时的要展示Loading会一闪而过
//   // 开发环境下所有的请求都延迟200ms来查看路由跳转获取数据的Loading过渡效果
//   const fakeDelay = (ms = 200) => new Promise(res => setTimeout(res, ms))
//   // 拦截请求
//   // axios.interceptors.request.use(async config => {
//   //   await fakeDelay()
//   //   return config
//   // })

//   // 拦截响应
//   axios.interceptors.response.use(async config => {
//     await fakeDelay()
//     return config
//   })
// }
