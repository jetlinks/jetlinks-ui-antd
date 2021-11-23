import request from "@/utils/request";

interface GetDeviceList {
  where?: string
  orderBy?: string
  total?: string
  paging?: string
  firstPageIndex?: string
  pageSize?: number
}


interface MediaDeviceListOther {
  password: string
  url: string
  username: string
  mediaProfiles: Array<MediaProfiles>
}
interface MediaProfiles {
  id: string
  name: string
  token: string
}

type StatusType = {
  text: string
  value: string
}
export interface MediaDeviceList {
  channelNumber: number
  createTime: number
  port: number
  firmware: string
  host: string
  id: string
  deviceId:string
  manufacturer: string
  model: string
  name: string
  provider: string
  others: MediaDeviceListOther
  state: StatusType
  description:string
}

type catalogType = {
  text: string
  value: string
}

type ptzType = {
  text: string
  value: string | number
}
export interface ChannelList extends Omit<MediaDeviceList, 'channelNumber' | 'createTime' | 'port' | 'firmware' | 'others' | 'host' | 'state'> {
  catalogType: catalogType
  channelId: string
  deviceId: string
  deviceName: string
  features: []
  gb28181ChannelId: string
  gb28181ProxyStream: true
  others: MediaProfiles
  ptzType: ptzType
  status: StatusType
}

export async function list(params: any) {
  return request(`/jetlinks/device/instance/_query`, {
    method: 'GET',
    params,
  });
}
export async function save(params: any) {
  return request(`/jetlinks/device-instance`, {
    method: 'POST',
    data: params,
  });
}

export async function update(params: any) {
  return request(`/jetlinks/device-instance`, {
    method: 'PATCH',
    data: params,
  });
}

// export async function info(id: string) {
//   return request(`/jetlinks/device/instance/${id}/detail`, {
//     method: 'GET',
//   });
// }
export async function info(deviceId: string) {
  return request(`/jetlinks/edge/operations/localDevice/detail`, {
    method: 'GET',
  });
}

export async function remove(id: string) {
  return request(`/jetlinks/device-instance/${id}`, {
    method: 'DELETE',
  });
}

export async function getOnvif(id: string, params: any) {
  return request(`/jetlinks/edge/operations/${id}/onvif-information/invoke`, {
    method: 'POST',
    data: params
  });
}

export async function getOnvifList(id: string) {
  return request(`/jetlinks/edge/operations/${id}/onvif-discover/invoke`, {
    method: 'POST'
  });
}

export async function addOnvif(id: string, params: any) {
  return request(`/jetlinks/edge/operations/${id}/onvif-add/invoke`, {
    method: 'POST',
    data: params
  });
}

export async function getOnvifStream(id: string) {
  return request(`/jetlinks/edge/operations/${id}/onvif-stream/invoke`, {
    method: 'POST'
  });
}

export async function getDeviceList(id: string, params: GetDeviceList = {}) {
  return request(`/jetlinks/edge/operations/${id}/media-device-list/invoke`, {
    method: 'POST',
    data: params
  });
}

export async function getChannelList(id: string, params: any) {
  return request(`/jetlinks/edge/operations/${id}/media-channel-list/invoke`, {
    method: 'POST',
    data: params
  });
}

export async function saveChannel(deviceId: string, params: any) {
  return request(`/jetlinks/edge/operations/${deviceId}/media-channel-save/invoke`, {
    method: 'POST',
    data: params
  });
}

export async function delDevice(deviceId: string, params: any) {
  return request(`/jetlinks/edge/operations/${deviceId}/media-device-delete/invoke`, {
    method: 'POST',
    data: params
  });
}

export async function delChannel(deviceId: string, params: any) {
  return request(`/jetlinks/edge/operations/${deviceId}/media-channel-delete/invoke`, {
    method: 'POST',
    data: params
  });
}

export async function getDeviceInfo(deviceId: string, params: any) {
  return request(`/jetlinks/edge/operations/${deviceId}/media-device-info/invoke`, {
    method: 'POST',
    data: params
  });
}

export async function getChannelInfo(deviceId: string, params: any) {
  return request(`/jetlinks/edge/operations/${deviceId}/media-channel-info/invoke`, {
    method: 'POST',
    data: params
  });
}

export async function reload(deviceId: string) {
  return request(`/jetlinks/edge/operations/${deviceId}/restart/invoke`, {
    method: 'POST'
  });
}

export async function getProperty(deviceId: string, id: string) {
  return request(`/jetlinks/edge/operations/${deviceId}/property/${id}`, {
    method: 'GET'
  });
}


export async function getDeviceCount(data: any) {
  return request(`/jetlinks/edge/operations/local/device-instances-status/invoke`, {
    method: 'POST',
    data
  });
}