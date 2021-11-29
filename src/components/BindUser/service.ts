import Axios from '@/utils/axios'
import { baseUrl } from '@/utils/base-service'
export function getUserList (params?: any): Promise<any> {
  return Axios({
    url: `${baseUrl}/user/_query`,
    method: 'GET',
    params
  })
}

export function bindUser (data?: any): Promise<any> {
  return Axios({
    url: `${baseUrl}/dimension-user`,
    method: 'PATCH',
    data
  })
}

export function unbindUser (id: string, data?: any): Promise<any> {
  return Axios({
    url: `${baseUrl}/dimension-user/user/role/${id}/_unbind`,
    method: 'POST',
    data
  })
}

export function orgBindUser (id: string, data?: any): Promise<any> {
  return Axios({
    url: `${baseUrl}/organization/${id}/users/_bind`,
    method: 'POST',
    data
  })
}

export function orgUnbindUser (id: string, data?: any): Promise<any> {
  return Axios({
    url: `${baseUrl}/organization/${id}/users/_unbind`,
    method: 'POST',
    data
  })
}
