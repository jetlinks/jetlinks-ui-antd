import Axios from '@/utils/axios'

/**
 * 验证是否需要验证码
 */
export function isCaptchaConfig () {
  return Axios({
    url: '/jetlinks/authorize/captcha/config',
    method: 'GET'
  })
}

/**
 * 获取验证码
 */
export function getCaptcha (params: {width: number, height: number}) {
  return Axios({
    url: '/jetlinks/authorize/captcha/image',
    method: 'GET',
    params
  })
}

/**
 * 登录
 */
export function login (data: any) {
  return Axios({
    url: '/jetlinks/authorize/login',
    method: 'POST',
    data
  })
}

/**
 * 获取jetlinks版本
 */
export function getSystemVersion () {
  return Axios({
    url: '/jetlinks/system/version',
    method: 'GET'
  })
}
