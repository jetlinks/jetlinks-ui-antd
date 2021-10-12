import type { TenantItem } from '@/pages/system/Tenant/typings';
import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import { defer, from } from 'rxjs';
import { filter, map } from 'rxjs/operators';

class Service extends BaseService<TenantItem> {
  queryList = (params: any) =>
    request(`${this.uri}/detail/_query`, {
      method: 'GET',
      params,
    });

  update = (data: any) => request(`${this.uri}/_create`, { data, method: 'POST' });

  queryDetail = (id: string) =>
    defer(() =>
      from(
        request(`${this.uri}/${id}`, {
          method: 'GET',
        }),
      ),
    ).pipe(
      filter((item) => item.status === 200),
      map((item) => item.result),
    );

  queryMembers = (id: string, params: Record<string, unknown>) =>
    request(`${this.uri}/${id}/members/_query`, { method: 'GET', params });
}

export default Service;
