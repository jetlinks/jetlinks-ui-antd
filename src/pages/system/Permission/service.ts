import BaseService from '@/utils/BaseService';
import type { PermissionItem } from '@/pages/system/Permission/typings';
import { defer, from } from 'rxjs';
import { request } from '@@/plugin-request/request';
import SystemConst from '@/utils/const';
import { map } from 'rxjs/operators';

class Service extends BaseService<PermissionItem> {
  public getPermission = (data: any) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/permission/_query/no-paging`, {
          method: 'POST',
          data,
        }),
      ),
    ).pipe(map((item) => item));
  public getAssetTypes = () =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/asset/types`, {
          method: 'GET',
        }),
      ),
    ).pipe(map((item) => item));
  public batchAdd = (data: any) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/permission`, {
          method: 'PATCH',
          data,
        }),
      ),
    ).pipe(map((item) => item));
}

export default Service;
