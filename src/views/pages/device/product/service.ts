import Axios from '@/utils/axios'
import { baseUrl } from '@/utils/base-service'
export function getProductDetail (id: string): Promise<any> {
  return Axios({
    url: `${baseUrl}/device-product/${id}`,
    method: 'GET'
  })
}

export function getCategory (params: any): Promise<any> {
  return Axios({
    url: `${baseUrl}/device/category/_tree`,
    method: 'GET',
    params
  })
}

export function getDeviceCount (params: any): Promise<any> {
  return Axios({
    url: `${baseUrl}/device-instance/_count`,
    method: 'GET',
    params
  })
}

export function getStorageList (): Promise<any> {
  return Axios({
    url: `${baseUrl}/device/product/storage/policies`,
    method: 'GET'
  })
}

export function getMessageProtocolList (): Promise<any> {
  return Axios({
    url: `${baseUrl}/protocol/supports`,
    method: 'GET'
  })
}

export function getTransportsList (type: string): Promise<any> {
  return Axios({
    url: `${baseUrl}/protocol/${type}/transports`,
    method: 'GET'
  })
}

export function getOrgList (params: any): Promise<any> {
  return Axios({
    url: `${baseUrl}/organization/_all/tree`,
    method: 'GET',
    params
  })
}

// 获取默认物模型
export function getDefaultModel (id: string, transport: string): Promise<any> {
  return Axios({
    url: `${baseUrl}/protocol/${id}/${transport}/metadata`,
    method: 'GET'
  })
}

export function setDeploy (id: string): Promise<any> {
  return Axios({
    url: `${baseUrl}/device-product/${id}/deploy`,
    method: 'POST',
    data: {}
  })
}

export function setUnDeploy (id: string): Promise<any> {
  return Axios({
    url: `${baseUrl}/device-product/${id}/undeploy`,
    method: 'POST',
    data: {}
  })
}
