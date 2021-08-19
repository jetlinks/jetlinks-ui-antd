import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import type { DeviceInstance } from '@/pages/device/Instance/typings';

class Service extends BaseService<DeviceInstance> {
  public detail = (id: string) => request(`${this.uri}/${id}/detail`, { method: 'GET' });

  public getConfigMetadata = (id: string) =>
    request(`${this.uri}/${id}/config-metadata`, { method: 'GET' });
}

export default Service;
