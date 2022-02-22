import BaseService from '@/utils/BaseService';
import type { PermissionItem } from '@/pages/system/Permission/typings';
import { defer, from } from 'rxjs';
import { request } from '@@/plugin-request/request';
import SystemConst from '@/utils/const';
import { map } from 'rxjs/operators';

class Service extends BaseService<PermissionItem> {
  public getPermission = () =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/permission/_query/for-grant`, {
          method: 'GET',
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
        request(`/${SystemConst.API_BASE}/dimension/_batch`, {
          method: 'POST',
          data,
        }),
      ),
    ).pipe(map((item) => item));
}

export default Service;
