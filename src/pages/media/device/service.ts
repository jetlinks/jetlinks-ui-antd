import BaseService from '@/services/crud';
import request from '@/utils/request';
import { defer, from } from 'rxjs';
import { filter, map } from 'rxjs/operators';

class Service extends BaseService<any> {
  public queryProduct = (params: any) =>
    defer(() =>
      from(
        request(`/jetlinks/device/product/_query/no-paging?paging=false`, {
          method: 'GET',
          params,
        }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );

  public mediaGateway = (params: any) =>
    defer(() =>
      from(
        request(`/jetlinks/media/gateway/_query/no-paging?paging=false`, {
          method: 'GET',
          params,
        }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );

  public mediaDeviceNoPaging = (params: any) =>
    defer(() =>
      from(
        request(`/jetlinks/media/channel/_query/no-paging?paging=false`, {
          method: 'GET',
          params,
        }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );

  public mediaDevice = (deviceId: string) =>
    defer(() =>
      from(request(`/jetlinks/media/device/${deviceId}`, { method: 'GET' })).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );

  public deviceDetail = (deviceId: string) =>
    defer(() =>
      from(request(`/jetlinks/device/instance/${deviceId}/detail`, { method: 'GET' })).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );

  public getPlay = (deviceId: string, channelId: string) =>
    defer(() =>
      from(
        request(`/jetlinks/media/device/${deviceId}/${channelId}/_start`, { method: 'POST' }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );

  public getStop = (deviceId: string, channelId: string) =>
    defer(() =>
      from(
        request(`/jetlinks/media/device/${deviceId}/${channelId}/_stop`, { method: 'POST' }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp),
      ),
    );

  public getControlStart = (deviceId: string, channelId: string, direct: string, speed: number) =>
    defer(() =>
      from(
        request(`/jetlinks/media/device/${deviceId}/${channelId}/_ptz/${direct}/${speed}`, {
          method: 'POST',
        }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );

  public getControlStop = (deviceId: string, channelId: string) =>
    defer(() =>
      from(
        request(`/jetlinks/media/device/${deviceId}/${channelId}/_ptz/STOP`, { method: 'POST' }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );

  public _sync = (deviceId: string) =>
    defer(() =>
      from(request(`/jetlinks/media/device/${deviceId}/channels/_sync`, { method: 'POST' })).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );
  
  public getLocalVideoList = (deviceId: string, channelId: string, data: any) =>
    defer(() =>
      from(request(`/jetlinks/media/device/${deviceId}/${channelId}/records/in-local`,{ method: 'POST', data })).pipe(
        map(resp => resp),
      ),
    );

  public getServerVideoList = (deviceId: string, channelId: string, data: any) =>
    defer(() =>
      from(request(`/jetlinks/media/device/${deviceId}/${channelId}/records/in-server/files`,{ method: 'POST', data })).pipe(
        map(resp => resp),
      ),
    );

  public getAlreadyServerVideoList = (deviceId: string, channelId: string, data: any) =>
    defer(() =>
      from(request(`/jetlinks/media/device/${deviceId}/${channelId}/records/in-server`,{ method: 'POST', data })).pipe(
        map(resp => resp),
      ),
    );

  public isVideo = (deviceId: string, channelId: string) =>
    defer(() =>
      from(request(`/jetlinks/media/device/${deviceId}/${channelId}/live/recording`,{ method: 'GET' })).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );

  public startVideo = (deviceId: string, channelId: string, data: any) =>
    defer(() =>
      from(request(`/jetlinks/media/device/${deviceId}/${channelId}/_record`,{ method: 'POST', data })).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp),
      ),
    );
  
  public endVideo = (deviceId: string, channelId: string, data: any) =>
    defer(() =>
      from(request(`/jetlinks/media/device/${deviceId}/${channelId}/_stop-record`,{ method: 'POST', data })).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp),
      ),
    );
}

export default Service;
