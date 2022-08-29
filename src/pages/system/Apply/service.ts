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
}

export default Service;
