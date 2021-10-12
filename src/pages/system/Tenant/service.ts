import type { TenantItem } from '@/pages/system/Tenant/typings';
import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import { defer, from } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import SystemConst from '@/utils/const';

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

  queryMemberNoPaging = (id: string) =>
    defer(() =>
      from(request(`${this.uri}/${id}/members/_query/no-paging?paging=false`, { method: 'GET' })),
    ).pipe(
      filter((item) => item.status === 200),
      map((item) => item.result),
    );

  queryUser = (params: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/user/_query`, {
      method: 'GET',
      params,
    });

  handleUser = (id: string, data: Record<string, unknown>[] | string[], type: 'bind' | 'unbind') =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/tenant/${id}/members/_${type}`, {
          method: 'POST',
          data,
        }),
      ),
    ).pipe(
      filter((item) => item.status === 200),
      map((item) => item.result),
    );

  assets = {
    deviceCount: (params: any) =>
      defer(() =>
        from(
          request(`/${SystemConst.API_BASE}/device/instance/_count`, {
            method: 'GET',
            params,
          }),
        ).pipe(
          filter((resp) => resp.status === 200),
          map((resp) => resp.result),
        ),
      ),
    productCount: (params: any) =>
      defer(() =>
        from(
          request(`/${SystemConst.API_BASE}/device-product/_count`, {
            method: 'GET',
            params,
          }),
        ).pipe(
          filter((resp) => resp.status === 200),
          map((resp) => resp.result),
        ),
      ),
  };
}

export default Service;
