import BaseService from '@/services/crud';
import request from '@/utils/request';
import { defer, from } from 'rxjs';
import { filter, map } from 'rxjs/operators';

class Service extends BaseService<any> {

  public getPlay = (deviceId: string, params: any) =>
    defer(() =>
      from(
        request(`/jetlinks/edge/operations/${deviceId}/media-device-start-play/invoke`, { 
          method: 'POST',
          data: {
            deviceId: params.deviceId,
            channelId: params.channelId
          }
       }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );

  public getStop = (deviceId: string, params: any) =>
    defer(() =>
      from(
        request(`/jetlinks/edge/operations/${deviceId}/media-device-stop-play/invoke`, { 
          method: 'POST',
          data: {
            deviceId: params.deviceId,
            channelId: params.channelId
          }
        }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );

  public getControlStart = (deviceId: string, params: any) =>
    defer(() => 
      from(
        request(`/jetlinks/edge/operations/${deviceId}/media-device-ptz/invoke`, {
          method: 'POST',
          data: {
            deviceId: params.deviceId,
            channelId: params.channelId,
            direct: params.direct,
            speed: params.speed,
            stopDelaySeconds: params.stopDelaySeconds
          }
        }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );

  public getControlStop = (deviceId: string, params: any) =>
    defer(() =>
      from(
        request(`/jetlinks/edge/operations/${deviceId}/media-device-stop-ptz/invoke`, { 
          method: 'POST',
          data: {
            deviceId: params.deviceId,
            channelId: params.channelId
          }
        }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );
}

export default Service;
