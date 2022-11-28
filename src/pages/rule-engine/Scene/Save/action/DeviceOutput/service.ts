import BaseService from '@/utils/BaseService';
import { request } from '@@/plugin-request/request';
import SystemConst from '@/utils/const';

class Service<T> extends BaseService<T> {
  // 设备
  queryDeviceList = (params: any) => {
    return request<T>(`${SystemConst.API_BASE}/device/instance/_query`, {
      method: 'POST',
      data: params,
    });
  };

  // 查询产品列表
  getProductList = (params?: any) =>
    request(`/${SystemConst.API_BASE}/device/product/_query/no-paging?paging=false`, {
      method: 'GET',
      params,
    });

  // 产品
  queryProductList = (params: any) => {
    return request<T>(`${SystemConst.API_BASE}/device-product/_query`, {
      method: 'POST',
      data: params,
    });
  };
}

export default Service;
