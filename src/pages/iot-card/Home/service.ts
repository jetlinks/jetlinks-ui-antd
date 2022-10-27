import { request } from 'umi';
import SystemConst from '@/utils/const';
import BaseService from '@/utils/BaseService';

class Service extends BaseService<any> {
  queryFlow = (beginTime: any, endTime: any, data: any) =>
    request(`${SystemConst.API_BASE}/network/flow/_query/${beginTime}/${endTime}`, {
      method: 'POST',
      data,
    });
  queryState = (status: any) =>
    request(`${SystemConst.API_BASE}/network/card/${status}/state/_count`, {
      method: 'GET',
    });
  list = (data: any) =>
    request(`${SystemConst.API_BASE}/network/card/_query`, {
      method: 'POST',
      data,
    });
}
export default Service;
