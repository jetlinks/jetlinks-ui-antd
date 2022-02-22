import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import { defer, from } from 'rxjs';
import { map } from 'rxjs/operators';
import SystemConst from '@/utils/const';

class Service extends BaseService<RoleItem> {
  queryMenuList = (params: any) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/menu/user-own/list`, {
          method: 'GET',
          params,
        }),
      ),
    ).pipe(map((item) => item));
  bindUser = (roleId: string, params: any) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/role/${roleId}/users/_bind`, {
          method: 'POST',
          data: params,
        }),
      ),
    ).pipe(map((item) => item));
  unbindUser = (roleId: string, params: any) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/role/${roleId}/users/_unbind`, {
          method: 'POST',
          data: params,
        }),
      ),
    ).pipe(map((item) => item));
}

export default Service;
