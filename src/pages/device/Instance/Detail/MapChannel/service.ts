import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<any> {
  getChannel = (data?: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/channel/_query/no-paging`, {
      method: 'POST',
      data,
    });
  getCollector = (data?: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/collector/_query/no-paging`, {
      method: 'POST',
      data,
    });
  getPoint = (data?: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/point/_query/no-paging`, {
      method: 'POST',
      data,
    });
  getMap = (thingType: string, thingId: any, params?: any) =>
    request(`/${SystemConst.API_BASE}/things/collector/${thingType}/${thingId}/_query`, {
      method: 'GET',
      params,
    });
  removeMap = (thingType: string, thingId: any, data?: any) =>
    request(`/${SystemConst.API_BASE}/things/collector/${thingType}/${thingId}/_delete`, {
      method: 'POST',
      data,
    });
  // treeMap = (data?: any) =>
  //   request(
  //     `/${SystemConst.API_BASE}/data-collect/channel/_all/tree`,
  //     {
  //       method: 'POST',
  //       data: data,
  //     },
  //   );
  treeMap = (data: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/channel/_all/tree`, {
      method: 'POST',
      data: data,
    });
  saveMap = (thingId: any, provider: string, data?: any) =>
    request(`/${SystemConst.API_BASE}/things/collector/device/${thingId}/${provider}`, {
      method: 'PATCH',
      data: data,
    });
}

export default Service;
