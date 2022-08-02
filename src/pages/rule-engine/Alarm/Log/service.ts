import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<AlarmLogItem> {
  getTypes = () =>
    request(`/${SystemConst.API_BASE}/relation/types`, {
      method: 'GET',
    });

  handleLog = (id: string, data: any) =>
    request(`/${SystemConst.API_BASE}/alarm/record/${id}/_handle`, {
      method: 'POST',
      data,
    });

  queryDefaultLevel = () =>
    request(`/${SystemConst.API_BASE}/alarm/config/default/level`, {
      method: 'GET',
    });

  queryHandleHistory = (data: any) =>
    request(`/${SystemConst.API_BASE}/alarm/record/handle-history/_query`, {
      method: 'POST',
      data,
    });

  queryHistoryList = (data: any) =>
    request(`/${SystemConst.API_BASE}/alarm/history/_query`, {
      method: 'POST',
      data,
    });
  getProductList = (params?: any) =>
    request(`/${SystemConst.API_BASE}/device/product/_query/no-paging?paging=false`, {
      method: 'GET',
      params,
    });
  getDeviceList = (params?: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/_query/no-paging?paging=false`, {
      method: 'GET',
      params,
    });
  getOrgList = (params?: any) =>
    request(`/${SystemConst.API_BASE}/organization/_query/no-paging?paging=false`, {
      method: 'GET',
      params,
    });
}

export default Service;
