import Axios from '@/utils/axios'

/**
 * 获取前端配置
 */
export function getFrontConfig () {
  return Axios({
    url: '/jetlinks/system/config/front',
    method: 'GET'
  })
}

/**
 * 修改前端配置
 */
export function updateFrontConfig (data: any) {
  return Axios({
    url: '/jetlinks/system/config/front',
    method: 'POST',
    data
  })
}
/**
 * 获取用户信息和权限
 */
export function getAuthorizeInfo () {
  return Axios({
    url: '/jetlinks/authorize/me',
    method: 'GET'
  })
}
