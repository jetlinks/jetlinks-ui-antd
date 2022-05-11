import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<AliCloudType> {
  public detail = (id: string) => request(`${this.uri}/${id}/detail`, { method: 'GET' });

  // 查询产品列表
  public getProductList = (params?: any) =>
    request(`/${SystemConst.API_BASE}/device/product/_query/no-paging?paging=false`, {
      method: 'GET',
      params,
    });
}

export default Service;
