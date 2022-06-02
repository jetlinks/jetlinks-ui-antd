import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import type { DeviceItem } from '@/pages/media/Device/typings';
import SystemConst from '@/utils/const';

class Service extends BaseService<DeviceItem> {
  deviceCount = (data?: any) =>
    request(`${this.uri}/device/_count`, { methods: 'GET', params: data });

  channelCount = (data?: any) => request(`${this.uri}/channel/_count`, { method: 'POST', data });

  playingAgg = () => request(`${this.uri}/channel/playing/agg`, { method: 'GET' });

  fileAgg = () => request(`${this.uri}/record/file/agg`, { method: 'GET' });

  getMulti = (data: any) =>
    request(`/${SystemConst.API_BASE}/dashboard/_multi`, { method: 'POST', data });
}

export default Service;
