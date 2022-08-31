import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<ApplyItem> {
  getAppInfo = (id: string) =>
    request(`${SystemConst.API_BASE}/application/${id}/info`, {
      method: 'GET',
    });
  getProvidersAll = () =>
    request(`${SystemConst.API_BASE}/application/providers`, {
      method: 'GET',
    });
  queryRoleList = (params?: any) =>
    request(`${SystemConst.API_BASE}/role/_query/no-paging?paging=false`, {
      method: 'GET',
      params,
    });
  queryOrgList = (params?: any) =>
    request(`${SystemConst.API_BASE}/organization/_all/tree`, {
      method: 'GET',
      params,
    });
}

export default Service;
