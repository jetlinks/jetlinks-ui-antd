import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<StreamItem> {
  queryProviders = () =>
    request(`/${SystemConst.API_BASE}/media/server/providers`, {
      method: 'GET',
    });
}

export default Service;
