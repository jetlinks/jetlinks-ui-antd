import BaseService from '@/utils/BaseService';
import { request } from '@@/plugin-request/request';
import { defer, from } from 'rxjs';
import { filter, map } from 'rxjs/operators';

class Service extends BaseService<DataSourceItem> {
  changeStatus = (id: string, status: 'disable' | 'enable') =>
    request(`${this.uri}/${id}/_${status}`, { method: 'PUT' });

  getType = () =>
    defer(() =>
      from(request(`${this.uri}/types`, { method: 'GET' })).pipe(
        filter((resp) => resp.status === 200),
        map((resp) => resp.result),
      ),
    );
}

export default Service;
