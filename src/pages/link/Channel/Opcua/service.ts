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
  getDevice = (params?: any) =>
    request(`${SystemConst.API_BASE}/device-instance/_query`, {
      method: 'POST',
      data: params,
    });
  //绑定设备
  bind = (params: any) =>
    request(`${SystemConst.API_BASE}/opc/device-bind/batch/_create`, {
      method: 'POST',
      data: params,
    });
  getBindList = (params: any) =>
    request(`${SystemConst.API_BASE}/opc/device-bind/device-details/_query/no-paging`, {
      method: 'GET',
      params,
    });
  unbind = (params: any, opcUaId: string) =>
    request(`${SystemConst.API_BASE}/opc/device-bind/batch/${opcUaId}/_delete`, {
      method: 'POST',
      data: params,
    });
  deviceDetail = (id: any) =>
    request(`${SystemConst.API_BASE}/device-instance/${id}/detail`, {
      method: 'GET',
    });
}

export default Service;
