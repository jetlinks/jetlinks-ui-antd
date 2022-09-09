import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<StreamItem> {
  queryProviders = () =>
    request(`/${SystemConst.API_BASE}/media/server/providers`, {
      method: 'GET',
    });
  enalbe = (id: string) =>
    request(`/${SystemConst.API_BASE}/media/server/${id}/_enable`, {
      method: 'POST',
    });
  disable = (id: string) =>
    request(`/${SystemConst.API_BASE}/media/server/${id}/_disable`, {
      method: 'POST',
    });
}

export default Service;
