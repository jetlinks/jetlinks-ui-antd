import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<ReationItem> {
  getTypes = () =>
    request(`/${SystemConst.API_BASE}/relation/types`, {
      method: 'GET',
    });
}

export default Service;
