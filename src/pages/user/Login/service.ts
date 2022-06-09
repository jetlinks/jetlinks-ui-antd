import { defer, from } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import SystemConst from '@/utils/const';
import { request } from 'umi';

const Service = {
  captchaConfig: () =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/authorize/captcha/config`, {
          method: 'GET',
          errorHandler: () => {
            // 未开启验证码 不显示验证码
          },
        }),
      ).pipe(map((resp) => resp?.result)),
    ),

  getCaptcha: () =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/authorize/captcha/image?width=130&height=30`, {
          method: 'GET',
        }),
      ).pipe(map((resp) => resp.result)),
    ),

  login: (data: LoginParam) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/authorize/login`, {
          method: 'POST',
          data,
        }),
      ).pipe(
        filter((r) => r.status === 200),
        map((resp) => resp.result),
      ),
    ),

  queryCurrent: () =>
    request(`/${SystemConst.API_BASE}/authorize/me`, {
      method: 'GET',
    }),

  logout: () =>
    request(`${SystemConst.API_BASE}/user-token/reset`, {
      method: 'GET',
    }),
  bindInfo: (params?: any) =>
    request(`/${SystemConst.API_BASE}/sso/providers`, {
      method: 'GET',
      params,
    }),
  settingDetail: (scopes: any) =>
    request(`/${SystemConst.API_BASE}/system/config/${scopes}`, {
      method: 'GET',
    }),
};

export default Service;
