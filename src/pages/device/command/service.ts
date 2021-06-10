import BaseService from '@/services/crud';
import { defer, from } from 'rxjs';
import request from '@/utils/request';
import { map, filter } from 'rxjs/operators';

class Service extends BaseService<any> {
  public start = (id: string) =>
    defer(() =>
      from(
        request(`${this.uri}/${id}/start`, {
          method: 'POST',
        }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );

  public resend = (params: any) =>
    defer(() =>
      from(
        request(`${this.uri}/state/wait`, {
          method: 'PUT',
          params,
        }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );

  public productList = () =>
    defer(() =>
      from(
        request(`/jetlinks/device/product/_query/no-paging?paging=false`, { method: 'GET' }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );

  public sendCommand = (data: any) =>
    defer(() =>
      from(request(`/jetlinks/device/message/task`, { method: 'POST', data })).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );

  public sendBatchCommand = (params: any) =>
    defer(() =>
      from(
        request(`/jetlinks/device/message/task/state/wait`, {
          method: 'PUT',
          params,
        }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );
}

export default Service;
