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

  public rdbTree = (datasourceId: string) =>
    defer(() =>
      from(request(`/jetlinks/datasource/rdb/${datasourceId}/tables?includeColumns=false`, { method: 'GET' })).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp),
      ),
    );

  public rdbTables = (datasourceId: string, table: string) =>
    defer(() =>
      from(request(`/jetlinks/datasource/rdb/${datasourceId}/table/${table}`, { method: 'GET' })).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp),
      ),
    );
  public saveRdbTables = (datasourceId: string, data: any) =>
    defer(() =>
      from(request(`/jetlinks/datasource/rdb/${datasourceId}/table`, { method: 'PATCH', data })).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp),
      ),
    );
  // 删除列
  public delRdbTablesColumn = (datasourceId: string, table: string, data: any) =>
    defer(() =>
      from(request(`/jetlinks/datasource/rdb/${datasourceId}/table/${table}/drop-column`, { method: 'POST', data })).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp),
      ),
    );
}

export default Service;
