import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<any> {
  save = (data?: any) =>
    request(`/${SystemConst.API_BASE}/system/config/scope/_save`, {
      method: 'POST',
      data,
    });
  detail = (data?: any) =>
    request(`/${SystemConst.API_BASE}/system/config/scopes`, {
      method: 'POST',
      data,
    });
}

export default Service;
