import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';
class Service extends BaseService<AliCloudType> {
  // 获取服务地址的下拉列表
  public getRegionsList = (params?: any) =>
    request(`/${SystemConst.API_BASE}/device/aliyun/bridge/regions`, {
      method: 'GET',
      params,
    }).then((resp: any) => {
      return resp.result?.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    });
  // 产品映射中的阿里云产品下拉列表
  public getAliyunProductsList = (data?: any) =>
    request(`/${SystemConst.API_BASE}/device/aliyun/bridge/products/_query`, {
      method: 'POST',
      data,
    }).then((resp: any) => {
      return resp.result.data?.map((item: any) => ({
        label: item.productName,
        value: item.productKey,
      }));
    });

  // 产品下拉列表
  public getProductsList = (data?: any) =>
    request(`/${SystemConst.API_BASE}/device-product/_query/no-paging`, {
      method: 'POST',
      data,
    }).then((resp: any) => {
      return resp.result?.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    });

  // 启用
  public _enable = (id: string, data?: any) =>
    request(`/${SystemConst.API_BASE}/device/aliyun/bridge/${id}/enable`, {
      method: 'POST',
      data,
    });

  // 禁用
  public _disable = (id: string, data?: any) =>
    request(`/${SystemConst.API_BASE}/device/aliyun/bridge/${id}/disable`, {
      method: 'POST',
      data,
    });
}

export default Service;
