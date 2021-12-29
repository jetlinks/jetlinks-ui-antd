import Axios from '@/utils/axios'
import { baseUrl } from '@/utils/base-service'
export function getOrganizationList (): Promise<any> {
  return Axios({
    url: `${baseUrl}/organization/_all`,
    method: 'GET'
  })
}

export function getAllProductList (): Promise<any> {
  return Axios({
    url: `${baseUrl}/device-product/_query/no-paging`,
    method: 'GET',
    params: {
      paging: false
    }
  })
}
