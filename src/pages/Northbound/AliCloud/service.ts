import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';
class Service extends BaseService<AliCloudType> {
  // 获取服务地址的下拉列表
  public getRegionsList = (params?: any) =>
    request(`/${SystemConst.API_BASE}/device/aliyun/bridge/regions`, {
      method: 'GET',
      params,
    });

  // 产品映射中的阿里云产品下拉列表
  public getProductsList = (data?: any) =>
    request(`/${SystemConst.API_BASE}/device/aliyun/bridge/products/_query`, {
      method: 'POST',
      data,
    });
}

export default Service;
