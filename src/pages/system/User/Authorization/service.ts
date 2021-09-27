import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';
import { defer, from } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

class Service extends BaseService<unknown> {
  public getDimensionType = () =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/dimension-type/all`, {
          method: 'GET',
        }),
      ),
    );

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

  public getAutzSetting = (params?: Record<string, any>) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/autz-setting/_query/no-paging`, {
          method: 'GET',
          params,
        }),
      ),
    ).pipe(
      filter((item) => item.status === 200),
      mergeMap((item) => item.result as AuthorizationItem[]),
    );
}

export default Service;
