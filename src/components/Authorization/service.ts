import Axios from '@/utils/axios'
import { baseUrl } from '@/utils/base-service'
export function typeList (params?: any): Promise<any> {
  return Axios({
    url: `${baseUrl}/dimension-type/all`,
    method: 'GET',
    params
  })
}

export function treeList (params?: any): Promise<any> {
  return Axios({
    url: `${baseUrl}/dimension/_query/tree`,
    method: 'GET',
    params
  })
}

export function listNoPaging (params?: any) : Promise<any> {
  return Axios({
    url: `${baseUrl}/permission/_query/for-grant`,
    method: 'GET',
    params
  })
}

export function getAutzSetting (params?: any) : Promise<any> {
  return Axios({
    url: `${baseUrl}/autz-setting/_query/no-paging`,
    method: 'GET',
    params
  })
}

export function saveAutz (data: any) : Promise<any> {
  return Axios({
    url: `${baseUrl}/autz-setting/detail/_save`,
    method: 'POST',
    data
  })
}
