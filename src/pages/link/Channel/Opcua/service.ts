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
    request(`/${SystemConst.API_BASE}/device-instance/_query`, {
      method: 'POST',
      data: params,
    });
  //绑定设备
  bind = (params: any) =>
    request(`/${SystemConst.API_BASE}/opc/device-bind/batch/_create`, {
      method: 'POST',
      data: params,
    });
  getBindList = (params: any) =>
    request(`/${SystemConst.API_BASE}/opc/device-bind/device-details/_query/no-paging`, {
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
  addPoint = (params: any) =>
    request(`${SystemConst.API_BASE}/opc/point`, {
      method: 'POST',
      data: params,
    });
  PointList = (params: any) =>
    request(`${SystemConst.API_BASE}/opc/point/_query`, {
      method: 'POST',
      data: params,
    });
  editPoint = (params: any, id: string) =>
    request(`/${SystemConst.API_BASE}/opc/point/${id}`, {
      method: 'PUT',
      data: params,
    });
  deletePoint = (id: string) =>
    request(`/${SystemConst.API_BASE}/opc/point/${id}`, {
      method: 'DELETE',
    });
  enablePoint = (bindDeviceId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/opc/device-bind/points/${bindDeviceId}/_start`, {
      method: 'POST',
      data,
    });
  stopPoint = (bindDeviceId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/opc/device-bind/points/${bindDeviceId}/_stop`, {
      method: 'POST',
      data,
    });
  noPagingOpcua = (data: any) =>
    request(`/${SystemConst.API_BASE}/opc/client/_query/no-paging`, {
      method: 'POST',
      data,
    });
}

export default Service;
