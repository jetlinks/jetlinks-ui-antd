import BaseService from '@/utils/BaseService';
import SystemConst from '@/utils/const';
import { request } from 'umi';

class Service extends BaseService<any> {
  serverNode = () =>
    request(`/${SystemConst.API_BASE}/network/resources/clusters`, { method: 'GET' });

  /**
   * echarts数据
   */
  queryMulti = (data: any) =>
    request(`/${SystemConst.API_BASE}/dashboard/_multi`, { method: 'POST', data });
}

export default Service;
