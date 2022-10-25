import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<any> {
  restPassword = (deviceId: string, data?: any) =>
    request(
      `/${SystemConst.API_BASE}/edge/operations/${deviceId}/auth-user-password-reset/invoke`,
      {
        method: 'POST',
        data,
      },
    );
  edgeChannel = (deviceId: string, data?: any) =>
    request(
      `/${SystemConst.API_BASE}/edge/operations/${deviceId}/data-collector-channel-list/invoke`,
      {
        method: 'POST',
        data,
      },
    );
  edgeCollector = (deviceId: string, data?: any) =>
    request(`/${SystemConst.API_BASE}/edge/operations/${deviceId}/data-collector-list/invoke`, {
      method: 'POST',
      data,
    });
  edgePoint = (deviceId: string, data?: any) =>
    request(
      `/${SystemConst.API_BASE}/edge/operations/${deviceId}/data-collector-point-list/invoke`,
      {
        method: 'POST',
        data,
      },
    );
  getMap = (deviceId: string, data?: any) =>
    request(`/${SystemConst.API_BASE}/edge/operations/${deviceId}/device-collector-list/invoke`, {
      method: 'POST',
      data,
    });
  removeMap = (deviceId: string, data?: any) =>
    request(`/${SystemConst.API_BASE}/edge/operations/${deviceId}/device-collector-delete/invoke`, {
      method: 'POST',
      data,
    });
}

export default Service;
