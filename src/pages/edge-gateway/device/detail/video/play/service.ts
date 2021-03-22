import BaseService from '@/services/crud';
import request from '@/utils/request';
import { defer, from } from 'rxjs';
import { filter, map } from 'rxjs/operators';

class Service extends BaseService<any> {

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
        map(resp => resp.result),
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
}

export default Service;
