import Axios from '@/utils/axios'
import { baseUrl } from '@/utils/base-service'
export function getForGrant (): Promise<any> {
  return Axios({
    url: `${baseUrl}/permission/_query/for-grant`,
    method: 'GET'
  })
}
