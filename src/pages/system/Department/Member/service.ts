import BaseService from '@/utils/BaseService';
import type { MemberItem } from '@/pages/system/Department/typings';
import { defer, from } from 'rxjs';
import { request } from '@@/plugin-request/request';
import SystemConst from '@/utils/const';
import { filter, map } from 'rxjs/operators';

class Service extends BaseService<MemberItem> {
  queryUser = (params: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/user/_query`, {
      method: 'POST',
      data: params,
    });

  handleUser = (id: string, data: Record<string, unknown>[] | string[], type: 'bind' | 'unbind') =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/organization/${id}/users/_${type}`, {
          method: 'POST',
          data,
        }),
      ),
    ).pipe(
      filter((item) => item.status === 200),
      map((item) => item.result),
    );
}

export default Service;
