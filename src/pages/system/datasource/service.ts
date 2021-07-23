import BaseService from '@/services/crud';
import { defer, from } from 'rxjs';
import request from '@/utils/request';
import { map, filter } from 'rxjs/operators';

class Service extends BaseService<any> {
  public changeStatus = (id: string, status: 'disable' | 'enable') =>
    defer(() =>
      from(request(`${this.uri}/${id}/_${status}`, { method: 'PUT' })).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );

  public type = () =>
    defer(() =>
      from(request(`${this.uri}/types`, { method: 'GET' })).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );
}

export default Service;
