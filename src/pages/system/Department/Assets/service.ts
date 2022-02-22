import BaseService from '@/utils/BaseService';
import { request } from '@@/plugin-request/request';
import SystemConst from '@/utils/const';
import { defer, from } from 'rxjs';
import { filter, map } from 'rxjs/operators';

class Service<T> extends BaseService<T> {
  // 资产绑定
  bind = (type: string, params: any) =>
    defer(() => from(request(`${this.uri}/bind/${type}`, { method: 'POST', data: params }))).pipe(
      filter((item) => item.status === 200),
      map((item) => item.result),
    );

  // 资产解绑
  unBind = (type: string, params: any) =>
    defer(() => from(request(`${this.uri}/unbind/${type}`, { method: 'POST', data: params }))).pipe(
      filter((item) => item.status === 200),
      map((item) => item.result),
    );

  // 资产-产品分类
  queryProductCategoryList = (params: any) => {
    return request(`${SystemConst.API_BASE}/device/category/_tree`, {
      method: 'POST',
      data: {
        ...params,
        paging: false,
      },
    });
  };
  // 资产-设备
  queryDeviceList = (params: any) => {
    return request<T>(`${SystemConst.API_BASE}/device/instance/_query`, {
      method: 'POST',
      data: params,
    });
  };
  // 资产-产品
  queryProductList = (params: any) => {
    return request<T>(`${SystemConst.API_BASE}/device-product/_query`, {
      method: 'POST',
      data: params,
    });
  };
}

export default Service;
