import BaseService from "@/services/crud";
import request from "@/utils/request";
import { defer, from } from "rxjs";
import { filter, map } from "rxjs/operators";

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
