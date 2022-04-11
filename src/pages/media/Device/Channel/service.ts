import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import type { ChannelItem } from './typings';

class Service extends BaseService<ChannelItem> {
  //
  queryTree = (id: string, data?: any) =>
    request(`${this.uri}/device/${id}/catalog/_query/tree`, { method: 'POST', data });

  // 查询设备通道列表
  queryChannel = (id: string, data: any) =>
    request(`${this.uri}/device/${id}/channel/_query`, { method: 'POST', data });

  updateChannel = (id: string, data: any) =>
    request(`${this.uri}/channel/${id}`, { method: 'PUT', data });

  saveChannel = (data: any) => request(`${this.uri}/channel`, { method: 'POST', data });

  removeChannel = (id: string) => request(`${this.uri}/channel/${id}`, { method: 'DELETE' });

  // 设备详情
  deviceDetail = (id: string) => request(`${this.uri}/device/${id}`, { method: 'GET' });
}

export default Service;
