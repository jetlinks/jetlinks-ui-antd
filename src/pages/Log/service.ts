import { request } from 'umi';
import BaseService from '@/utils/BaseService';
import SystemConst from '@/utils/const';

class Service extends BaseService<any> {
  public getServer = () =>
    request(`/${SystemConst.API_BASE}/network/resources/clusters`, {
      method: 'GET',
    });
}

export default Service;
