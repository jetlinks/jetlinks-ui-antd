import BaseService from '@/utils/BaseService';
import SystemConst from '@/utils/const';
import { request } from 'umi';

class Service extends BaseService<any> {
  serverNode = () =>
    request(`/${SystemConst.API_BASE}/network/resources/clusters`, { method: 'GET' });

  /**
   * 网络流量
   */
  networkMulti = (data: any) =>
    request(`/${SystemConst.API_BASE}/dashboard_multi`, { method: 'POST', data });
}

export default Service;
