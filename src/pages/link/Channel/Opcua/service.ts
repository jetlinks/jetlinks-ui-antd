import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<OpaUa> {
  enable = (id: string) =>
    request(`${SystemConst.API_BASE}/opc/client/${id}/_enable`, {
      method: 'POST',
    });
  disable = (id: string) =>
    request(`${SystemConst.API_BASE}/opc/client/${id}/_disable`, {
      method: 'POST',
    });
  policies = (params?: any) =>
    request(`${SystemConst.API_BASE}/opc/client/security-policies`, {
      method: 'GET',
      params,
    });
  modes = (params?: any) =>
    request(`${SystemConst.API_BASE}/opc/client/security-modes`, {
      method: 'GET',
      params,
    });
}

export default Service;
