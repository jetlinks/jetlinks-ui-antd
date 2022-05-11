import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import { defer, from } from 'rxjs';
import { map } from 'rxjs/operators';
import SystemConst from '@/utils/const';

class Service extends BaseService<UserItem> {
  getUserDetail = (params?: any) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/user/detail`, {
          method: 'GET',
          params,
        }),
      ),
    ).pipe(map((item) => item));

  saveUserDetail = (data: any) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/user/detail`, {
          method: 'PUT',
          data,
        }),
      ),
    ).pipe(map((item) => item));
  savePassWord = (data: any) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/user/passwd`, {
          method: 'PUT',
          data,
        }),
      ),
    ).pipe(map((item) => item));

  validateField = (type: 'username' | 'password', name: string) =>
    request(`/${SystemConst.API_BASE}/user/${type}/_validate`, {
      method: 'POST',
      data: name,
    });
  validatePassword = (password: string) =>
    request(`/${SystemConst.API_BASE}/user/me/password/_validate`, {
      method: 'POST',
      data: password,
    });
  bindInfo = (params?: any) =>
    request(`/${SystemConst.API_BASE}/sso/me/bindings`, {
      method: 'GET',
      params,
    });
  bindUserInfo = (code: string) =>
    request(`/${SystemConst.API_BASE}/sso/bind-code/${code}`, {
      method: 'GET',
    });
  bind = (code: string) =>
    request(`/${SystemConst.API_BASE}/sso/me/bind/${code}`, {
      method: 'POST',
    });
  unbind = (type: string, provider: string) =>
    request(`/${SystemConst.API_BASE}/sso/me/${type}/${provider}/unbind`, {
      method: 'POST',
    });
}

export default Service;
