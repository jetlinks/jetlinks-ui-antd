import BaseService from '@/utils/BaseService';
import { request } from '@@/plugin-request/request';
import SystemConst from '@/utils/const';

class Service extends BaseService<ResourceItem> {
  _start = (data: any) =>
    request(`/${SystemConst.API_BASE}/entity/template/start/_batch`, {
      method: 'POST',
      data,
    });
  _stop = (data: any) =>
    request(`/${SystemConst.API_BASE}/entity/template/stop/_batch`, {
      method: 'POST',
      data,
    });
  queryDeviceList = (data: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/detail/_query`, {
      method: 'POST',
      data,
    });
}

export default Service;
