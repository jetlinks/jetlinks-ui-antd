import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<ReationItem> {
  getTypes = () =>
    request(`/${SystemConst.API_BASE}/relation/types`, {
      method: 'GET',
    });

  validator = (params: any) =>
    request(`/${SystemConst.API_BASE}/relation/_validate?`, {
      method: 'GET',
      params,
    });
}

export default Service;
