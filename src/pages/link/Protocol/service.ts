import type { ProtocolItem } from '@/pages/link/Protocol/typings';
import { request } from 'umi';
import BaseService from '@/utils/BaseService';
import SystemConst from '@/utils/const';

class Service extends BaseService<ProtocolItem> {
  public modifyState = (id: string, action: 'deploy' | 'un-deploy') =>
    request(`${this.uri}/${id}/_${action}`, {
      method: 'POST',
    });

  public covert = (data: Record<string, unknown>) =>
    request(`${this.uri}/convert`, { method: 'POST', data });

  public debug = (type: 'encode' | 'decode', data: Record<string, unknown>) =>
    request(`${this.uri}/${type}`, { method: 'POST', data });

  public validator = (id: string) => request(`${SystemConst.API_BASE}/protocol/${id}/exists`);

  public productCount = (data: Record<string, unknown>) =>
    request(`${SystemConst.API_BASE}/device-product/_count`, { method: 'POST', data });

  public querySystemApi = (data?: any) =>
    request(`/${SystemConst.API_BASE}/system/config/scopes`, {
      method: 'POST',
      data,
    });
}

export default Service;
