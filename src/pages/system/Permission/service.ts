import BaseService from '@/utils/BaseService';
import type { PermissionItem } from '@/pages/system/Permission/typings';
import { defer, from } from 'rxjs';
import { request } from '@@/plugin-request/request';
import SystemConst from '@/utils/const';
import { filter, mergeMap } from 'rxjs/operators';

class Service extends BaseService<PermissionItem> {
  public getPermission = () =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/permission/_query/for-grant`, {
          method: 'GET',
        }),
      ),
    ).pipe(
      filter((item) => item.status === 200),
      mergeMap((item) => item.result as PermissionItem[]),
    );
}

export default Service;
