import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<OpaUa> {
  edit = (data: any) =>
    request(`/${SystemConst.API_BASE}/modbus/master`, {
      method: 'PATCH',
      data,
    });
  bindDevice = (params: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/_query/no-paging?paging=false`, {
      method: 'GET',
      params,
    });
  getDevice = (params?: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/_query`, {
      method: 'POST',
      data: params,
    });
  bind = (params: any, id: string) =>
    request(`/${SystemConst.API_BASE}/modbus/master/${id}/_bind`, {
      method: 'POST',
      data: params,
    });
  unbind = (params: any, id: string) =>
    request(`/${SystemConst.API_BASE}/modbus/master/${id}/_unbind`, {
      method: 'POST',
      data: params,
    });
  deviceDetail = (id: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/${id}/detail`, {
      method: 'GET',
    });
  saveMetadataConfig = (master: string, deviceId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/modbus/master/${master}/${deviceId}/metadata`, {
      method: 'POST',
      data,
    });
  queryMetadataConfig = (master: string, deviceId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/modbus/master/${master}/${deviceId}/metadata/_query`, {
      method: 'POST',
      data,
    });
  removeMetadataConfig = (metadataId: string) =>
    request(`/${SystemConst.API_BASE}/modbus/master/metadata/${metadataId}`, {
      method: 'DELETE',
    });
}

export default Service;
