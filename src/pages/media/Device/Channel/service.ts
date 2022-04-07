import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import type { ChannelItem } from './typings';

class Service extends BaseService<ChannelItem> {
  //
  queryTree = (id: string, data: any) =>
    request(`${this.uri}/${id}/catalog/_query/tree`, { method: 'PATCH', data });
}

export default Service;
