import BaseService from '@/utils/BaseService';
import type { GatewayItem } from '@/pages/link/Gateway/typings';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<GatewayItem> {
  public action = (id: string, type: 'shutdown' | 'startup' | 'pause') =>
    request(`${this.uri}/${id}/_${type}`, { method: 'POST' });

  public getProviders = () => request(`${this.uri}/providers`, { method: 'GET' });

  public getProtocol = () =>
    request(`/${SystemConst.API_BASE}/protocol/supports`, { method: 'GET' });

  public getNetwork = (id: string) =>
    request(`/${SystemConst.API_BASE}/network/config/${id}/_detail`, {
      method: 'GET',
    });
}

export default Service;
