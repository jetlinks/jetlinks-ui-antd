import Axios from '@/utils/axios'
import { baseUrl } from '@/utils/base-service'
export function query (params: any): Promise<any> {
  return Axios({
    url: `${baseUrl}/device/category/_tree`,
    method: 'GET',
    params
  })
}

export function update (data: any): Promise<any> {
  return Axios({
    url: `${baseUrl}/device/category`,
    method: 'PATCH',
    data
  })
}

export function add (data: any): Promise<any> {
  return Axios({
    url: `${baseUrl}/device/category`,
    method: 'POST',
    data
  })
}

export function remove (id: string): Promise<any> {
  return Axios({
    url: `${baseUrl}/device/category/${id}`,
    method: 'DELETE'
  })
}
