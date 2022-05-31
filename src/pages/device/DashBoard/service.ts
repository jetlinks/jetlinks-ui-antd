import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import type { DeviceInstance } from '@/pages/device/Instance/typings';

class Service extends BaseService<DeviceInstance> {
  deviceCount = (data?: any) => request(`${this.uri}/_count`, { methods: 'GET', params: data });
}

export default Service;
