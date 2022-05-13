import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<platformsType> {
  queryRoleList = (params?: any) =>
    request(`${SystemConst.API_BASE}/role/_query/no-paging?paging=false`, {
      method: 'GET',
      params,
    });
}

export default Service;
