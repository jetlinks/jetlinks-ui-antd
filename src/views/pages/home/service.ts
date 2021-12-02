import Axios from '@/utils/axios'
import { baseUrl } from '@/utils/base-service'
import { Token } from '@/utils/utils'
export function getMulti (data: any): Promise<any> {
  return Axios({
    url: `${baseUrl}/dashboard/_multi?:X_Access_Token=${Token.get()}`,
    method: 'POST',
    data
  })
}
