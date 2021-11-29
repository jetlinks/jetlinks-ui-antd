import Axios from '@/utils/axios'
import { baseUrl } from '@/utils/base-service'
export function createTenant (data: any): Promise<any> {
  return Axios({
    url: `${baseUrl}/tenant/_create`,
    method: 'POST',
    data
  })
}

export function updateTenant (data: any): Promise<any> {
  return Axios({
    url: `${baseUrl}/tenant/${data.id}`,
    method: 'PUT',
    data
  })
}
