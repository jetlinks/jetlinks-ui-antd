import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';
import type { CascadeItem } from './typings';
import { concatMap, from, toArray } from 'rxjs';
import { map } from 'rxjs/operators';
import type { PageResult, Response } from '@/utils/typings';
import _ from 'lodash';

class Service extends BaseService<CascadeItem> {
  queryBindChannel = (id: string, data: any) =>
    request(`/${SystemConst.API_BASE}/media/gb28181-cascade/${id}/bindings/_query`, {
      method: 'POST',
      data,
    });

  queryZipCount = (params: any) =>
    from(this.query(params)).pipe(
      concatMap((i: Response<CascadeItem>) =>
        from((i.result as PageResult)?.data).pipe(
          concatMap((t: CascadeItem) =>
            from(this.queryBindChannel(t.id, {})).pipe(
              map((count: any) => ({ ...t, count: count.result?.total || 0 })),
            ),
          ),
          toArray(),
          map((data) => _.set(i, 'result.data', data) as any),
        ),
      ),
    );

  queryClusters = () =>
    request(`/${SystemConst.API_BASE}/network/resources/clusters`, {
      method: 'GET',
    });

  enabled = (id: string) =>
    request(`/${SystemConst.API_BASE}/media/gb28181-cascade/${id}/_enabled`, {
      method: 'POST',
    });

  disabled = (id: string) =>
    request(`/${SystemConst.API_BASE}/media/gb28181-cascade/${id}/_disabled`, {
      method: 'POST',
    });

  queryChannel = (data: any) =>
    request(`/${SystemConst.API_BASE}/media/channel/_query`, {
      method: 'POST',
      data,
    });

  bindChannel = (id: string, data: string[]) =>
    request(`/${SystemConst.API_BASE}/media/gb28181-cascade/${id}/_bind`, {
      method: 'POST',
      data,
    });

  unbindChannel = (id: string, data: string[]) =>
    request(`/${SystemConst.API_BASE}/media/gb28181-cascade/${id}/_unbind`, {
      method: 'POST',
      data,
    });
  // 编辑绑定信息
  editBindInfo = (id: string, data: any) =>
    request(`/${SystemConst.API_BASE}/media/gb28181-cascade/binding/${id}`, {
      method: 'PUT',
      data,
    });
  //
  queryResources = () =>
    request(`/${SystemConst.API_BASE}/network/resources/alive/_all`, {
      method: 'GET',
    });
  validateId = (cascadeId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/media/gb28181-cascade/${cascadeId}/gbChannelId/_validate`, {
      method: 'POST',
      data,
    });
}

export default Service;
