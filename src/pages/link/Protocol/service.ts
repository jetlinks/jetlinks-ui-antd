import type { ProtocolItem } from '@/pages/link/Protocol/typings';
import { request } from 'umi';
import BaseService from '@/utils/BaseService';

class Service extends BaseService<ProtocolItem> {
  public modifyState = (id: string, action: 'deploy' | 'un-deploy') =>
    request(`${this.uri}/${id}/_${action}`, {
      method: 'POST',
    });

  public covert = (data: Record<string, unknown>) =>
    request(`${this.uri}/convert`, { method: 'POST', data });

  public debug = (type: 'encode' | 'decode', data: Record<string, unknown>) =>
    request(`${this.uri}/${type}`, { method: 'POST', data });
}

export default Service;
