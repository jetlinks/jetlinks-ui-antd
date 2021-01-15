import BaseService from "@/services/crud";
import request from "@/utils/request";
import { defer, from } from "rxjs";
import { filter, map } from "rxjs/operators";

class Service extends BaseService<any> {

  public groupDevice = (param: any) => defer(
    () => from(request(`/jetlinks/device-instance/_query/no-paging?paging=false`, {
      method: 'GET',
      params: param
    })).pipe(
      filter(resp => resp.status === 200),
      map(resp => resp.result)
    ));

  public getProduct = (param: any) => defer(
    () => from(request(`/jetlinks/media/gb28181/_query/no-paging?paging=false`, {
      method: 'GET',
      params: param
    })).pipe(
      filter(resp => resp.status === 200),
      map(resp => resp.result)
    ));
  public getChannel = (param: any) => defer(
    () => from(request(`/jetlinks/media/channel/_query/no-paging?paging=false`, {
      method: 'GET',
      params: param
    })).pipe(
      filter(resp => resp.status === 200),
      map(resp => resp.result)
    ));
  public getPlay = (deviceId: string, channelId: string) => defer(
    () => from(request(`/jetlinks/media/device/${deviceId}/${channelId}/_start`, {
      method: 'POST'
    })).pipe(
      filter(resp => resp.status === 200),
      map(resp => resp.result)
    ));
  public getStop = (deviceId: string, channelId: string) => defer(
    () => from(request(`/jetlinks/media/device/${deviceId}/${channelId}/_stop`, {
      method: 'POST'
    })).pipe(
      filter(resp => resp.status === 200),
      map(resp => resp.result)
    ));
}

export default Service;