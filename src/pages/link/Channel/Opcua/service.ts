import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<OpaUa> {
  saveOpc = (data: any) =>
    request(`${SystemConst.API_BASE}/opc/client`, {
      method: 'POST',
      data,
    });
  editOpc = (id: string, data: any) =>
    request(`${SystemConst.API_BASE}/opc/client/${id}`, {
      method: 'PUT',
      data,
    });
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
  getPoint = (params: any) =>
    request(`${SystemConst.API_BASE}/opc/point/_query/no-paging`, {
      method: 'POST',
      data: params,
    });
  editPoint = (id: string, params: any) =>
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
  noPagingOpcua = (data: any) =>
    request(`/${SystemConst.API_BASE}/opc/client/_query/no-paging`, {
      method: 'POST',
      data,
    });
  queryPoint = (opcUaId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/opc/point/${opcUaId}/_query`, {
      method: 'POST',
      data,
    });
  removeDevicePoint = (deviceId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/things/collector/device/${deviceId}/_delete`, {
      method: 'POST',
      data,
    });
  //查询设备点位映射配置
  getDevicePoint = (deviceId: string, param?: string) =>
    request(`/${SystemConst.API_BASE}/things/collector/device/${deviceId}/_query`, {
      method: 'GET',
      param,
    });
  //保存设备绑定点位映射配置
  saveDevicePoint = (deviceId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/things/collector/device/${deviceId}/OPC_UA`, {
      method: 'PATCH',
      data,
    });
}

export default Service;
