import { request } from 'umi';
import SystemConst from '@/utils/const';
import BaseService from '@/utils/BaseService';
import type { NetworkItem } from '@/pages/link/Type/typings';

class Service extends BaseService<NetworkItem> {
  getProviders = () =>
    request(`${SystemConst.API_BASE}/gateway/device/providers`, {
      method: 'GET',
    });

  getSupports = () =>
    request(`${SystemConst.API_BASE}/network/config/supports`, {
      method: 'GET',
    });

  getResourcesCurrent = () =>
    request(`${SystemConst.API_BASE}/network/resources/alive/_current`, {
      method: 'GET',
    });

  getResourceClusters = () =>
    request(`${SystemConst.API_BASE}/network/resources/clusters`, {
      method: 'GET',
    });

  getResourceClustersById = (id: string) =>
    request(`${SystemConst.API_BASE}/network/resources/alive/${id}`, {
      method: 'GET',
    });

  getAllResources = () =>
    request(`${SystemConst.API_BASE}/network/resources/alive/_all`, {
      method: 'GET',
    });

  changeState = (id: string, status: 'start' | 'shutdown') =>
    request(`${SystemConst.API_BASE}/network/config/${id}/_${status}`, { method: 'POST' });
}

export default Service;
