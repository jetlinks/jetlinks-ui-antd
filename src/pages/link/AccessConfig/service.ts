import { request } from 'umi';
import BaseService from '@/utils/BaseService';
import SystemConst from '@/utils/const';
import type { AccessItem } from './typings';

class Service extends BaseService<AccessItem> {
  public queryGatewayDetail = (data: any) =>
    request(`/${SystemConst.API_BASE}/gateway/device/detail/_query`, {
      method: 'POST',
      data,
    });
  public queryList = (data: any) =>
    request(`/${SystemConst.API_BASE}/gateway/device/detail/_query`, {
      method: 'POST',
      data,
    });
  public startUp = (id: string) =>
    request(`/${SystemConst.API_BASE}/gateway/device/${id}/_startup`, {
      method: 'POST',
    });
  public shutDown = (id: string) =>
    request(`/${SystemConst.API_BASE}/gateway/device/${id}/_shutdown`, {
      method: 'POST',
    });
  public getProviders = () =>
    request(`/${SystemConst.API_BASE}/gateway/device/providers`, {
      method: 'GET',
    });
  public getNetworkList = (networkType: string, params?: any) =>
    request(`/${SystemConst.API_BASE}/network/config/${networkType}/_alive`, {
      method: 'GET',
      params,
    });
  public getProtocolList = (transport?: string, params?: any) => {
    return request(`/${SystemConst.API_BASE}/protocol/supports/${transport ? transport : ''}`, {
      method: 'GET',
      params,
    });
  };
  public getConfigView = (id: string, transport: string) =>
    request(`/${SystemConst.API_BASE}/protocol/${id}/transport/${transport}`, {
      method: 'GET',
    });

  public getClusters = () =>
    request(`/${SystemConst.API_BASE}/network/resources/clusters`, {
      method: 'GET',
    });
}

export default Service;
