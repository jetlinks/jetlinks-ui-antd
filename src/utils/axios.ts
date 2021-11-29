import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { notification } from 'ant-design-vue'
import router from '@/router'

const Axios = axios.create({
  // 联调
  // baseURL: process.env.NODE_ENV === 'production' ? `/` : '/api',
  baseURL: 'https://demo.jetlinks.cn',
  // baseURL: process.env.VUE_APP_BASE_API,
  timeout: 6000000 // 超时时间
})

// 请求拦截器
Axios.interceptors.request.use((config: AxiosRequestConfig) => {
  // 获取token，并将其添加至请求头中
  const token = localStorage.getItem('x-access-token') || null
  if (token) {
    config = {
      ...config,
      headers: {
        'X-Access-Token': token
      }
    }
  }
  const keys = Object.keys(config.params || {})
  if (config.method === 'get' && keys.length) {
    const params = new URLSearchParams()
    keys.forEach(item => {
      params.append(item, config.params[item])
    })
    config.url += `?${params.toString()}`
    config.params = {}
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 响应拦截器
Axios.interceptors.response.use((response: AxiosResponse) => {
  return response
}, (error) => {
  const code = error.response.status
  switch (code) {
    case 302:
      break
    case 307:
      break
    case 400:
      break
    case 401:
      router.replace('/login')
      break
    case 403: // 验证token是否过期
      break
    case 404:
      // router.replace('/404')
      break
    case 405:
      break
    case 406:
      break
    case 409:
      break
    case 410:
      break
    case 422:
      break
    case 500:
      break
    case 501:
      break
    case 502:
      break
    case 503:
      break
    case 504:
      break
    case 505:
      break
  }
  notification.error({
    message: 'error',
    description: error.response.data.message || '系统错误, 请联系管理员'
  })
  return Promise.resolve(error)
})

export default Axios
