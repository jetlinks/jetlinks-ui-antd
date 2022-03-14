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
  queryMenuTreeList = (data: any) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/menu/_all/tree`, {
          method: 'POST',
          data,
        }),
      ),
    ).pipe(map((item) => item));
  queryPermissionsList = (data: any) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/menu/permissions`, {
          method: 'POST',
          data,
        }),
      ),
    ).pipe(map((item) => item));
  queryAssetTypeList = (data: any) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/menu/asset-types`, {
          method: 'POST',
          data,
        }),
      ),
    ).pipe(map((item) => item));
  queryAssetsList = (type: string) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/assets/access-support/${type}`, {
          method: 'GET',
        }),
      ),
    ).pipe(map((item) => item));
  queryGrantTree = (targetType: string, targetId: string) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/menu/${targetType}/${targetId}/_grant/tree`, {
          method: 'GET',
        }),
      ),
    ).pipe(map((item) => item));
  saveGrantTree = (targetType: string, targetId: string, data: any) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/menu/${targetType}/${targetId}/_grant`, {
          method: 'PUT',
          data,
        }),
      ),
    ).pipe(map((item) => item));
  saveAutz = (data: any) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/autz-setting/detail/_save`, {
          method: 'POST',
          data,
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
