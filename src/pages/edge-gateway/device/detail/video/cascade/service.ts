import BaseService from "@/services/crud";
import request from "@/utils/request";
import { defer, from } from "rxjs";
import { filter, map } from "rxjs/operators";

type StatusType = {
  text: string
  value: string
}

interface SipConfigs {
  sipId: string
  domain: string
  stackName: string
  charset: string
  password: string
  publicAddress: string
  localAddress: string
  port: number
  publicPort: number
  clusterNodeId: string
  remoteAddress: string
  remotePort: number
  user: string
  localSipId: string
  name: string
  manufacturer: string
  model: string
  firmware: string
  transport: string
  registerInterval: number
  keepaliveInterval: number
  keepaliveTimeoutTimes: string
}
export interface CascadeList {
  id: string
  name: string
  status: StatusType
  onlineStatus: StatusType
  sipConfigs: Array<SipConfigs>
  proxyStream: boolean
  mediaServerId: string
}

export const getCascadeList = (deviceId: string, params: any) => request(`/jetlinks/edge/operations/${deviceId}/gb28181-cascade-list/invoke`, {
  method: 'POST',
  data: params
})

export const saveCascade = (deviceId: string, params: any) => request(`/jetlinks/edge/operations/${deviceId}/gb28181-cascade-save/invoke`, {
  method: 'POST',
  data: params
})

export const CascadeEnabled = (deviceId: string, params?: any) => request(`/jetlinks/edge/operations/${deviceId}/gb28181-cascade-enable/invoke`, {
  method: 'POST',
  data: params
})

export const CascadeDisabled = (deviceId: string, params?: any) => request(`/jetlinks/edge/operations/${deviceId}/gb28181-cascade-disable/invoke`, {
  method: 'POST',
  data: params
})

export const removeCascade = (deviceId: string, id: string) => request(`/jetlinks/edge/operations/${deviceId}/gb28181-cascade-delete/invoke`, {
  method: 'POST',
  data: {
    cascadeId: id
  }
})
class Service extends BaseService<any> {

  public getCascadeList = (deviceId: string, params: any) => defer(
    () => from(request(`/jetlinks/edge/operations/${deviceId}/gb28181-cascade-list/invoke`, {
      method: 'POST',
      data: params
    })).pipe(
      filter(resp => resp.status === 200),
      map(resp => resp.result[0])
    ));

  public _disabled = (deviceId: string, params: any) => defer(
    () => from(request(`/jetlinks/edge/operations/${deviceId}/gb28181-cascade-disable/invoke`, {
      method: 'POST',
      data: params
    })).pipe(
      filter(resp => resp.status === 200),
      map(resp => resp.result)
    ));

  public _enabled = (deviceId: string, params: any) => defer(
    () => from(request(`/jetlinks/edge/operations/${deviceId}/gb28181-cascade-enable/invoke`, {
      method: 'POST',
      data: params
    })).pipe(
      filter(resp => resp.status === 200),
      map(resp => resp.result)
    ));

  public saveCascade = (deviceId: any, data: any) => defer(
    () => from(request(`/jetlinks/edge/operations/${deviceId}/gb28181-cascade-save/invoke`, {
      method: 'POST',
      data: data
    }))
      .pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result)
      ));

  public insertCascade = (deviceId: any, data: any) => defer(
    () => from(request(`/jetlinks/edge/operations/${deviceId}/gb28181-cascade-insert/invoke`, {
      method: 'POST',
      data: data
    }))
      .pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result)
      ));

  public _bind = (deviceId: string, cascadeId: string, channelIds: any[]) => defer(
    () => from(request(`/jetlinks/edge/operations/${deviceId}/gb28181-cascade-bind/invoke`, {
      method: 'POST',
      data: {
        cascadeId: cascadeId,
        channelIds: channelIds
      }
    }))
      .pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result)
      ));

  public _unbind = (deviceId: string, cascadeId: string, channelIds: any[]) => defer(
    () => from(request(`/jetlinks/edge/operations/${deviceId}/gb28181-cascade-unbind/invoke`, {
      method: 'POST',
      data: {
        cascadeId: cascadeId,
        channelIds: channelIds
      }
    }))
      .pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result)
      ));
  public mediaServer = (deviceId: string) => defer(
    () => from(request(`/jetlinks/edge/operations/${deviceId}/media-server-list/invoke`, {
      method: 'POST',
      data: {}
    }))
      .pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result[0])
      ));
  public getChannelList = (deviceId: string, params: any) => defer(
    () => from(request(`/jetlinks/edge/operations/${deviceId}/media-channel-list/invoke`, {
      method: 'POST',
      data: params
    }))
      .pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result[0])
      ));
  public removeCascade = (deviceId: string, id: string) => defer(
    () => from(request(`/jetlinks/edge/operations/${deviceId}/gb28181-cascade-delete/invoke`, {
      method: 'POST',
      data: {
        cascadeId: id
      }
    }))
      .pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result)
      ));
}

export default Service;
