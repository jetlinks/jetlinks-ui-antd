import type { TenantItem } from '@/pages/system/Tenant/typings';
import BaseService from '@/utils/BaseService';
import { request } from 'umi';

class Service extends BaseService<TenantItem> {
  queryDetail = (params: any) => {
    return request(`/jetlinks/tenant/detail/_query`, {
      method: 'GET',
      params,
    });
  };
}

export default Service;
