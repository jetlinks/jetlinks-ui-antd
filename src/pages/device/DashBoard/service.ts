import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import SystemConst from '@/utils/const';

class Service extends BaseService<DeviceInstance> {
  deviceCount = (data?: any) => request(`${this.uri}/_count`, { methods: 'GET', params: data });
  productCount = (data?: any) =>
    request(`/${SystemConst.API_BASE}/device-product/_count`, {
      method: 'POST',
      data,
    });
  dashboard = (data?: any) =>
    request(`/${SystemConst.API_BASE}/dashboard/_multi`, {
      method: 'POST',
      data,
    });
}

export default Service;
