import BaseService from '@/utils/BaseService';
import type { OrgItem } from '@/pages/system/Org/typings';
import { request } from '@@/plugin-request/request';

class Service extends BaseService<OrgItem> {
  queryTree(params: any): Promise<any> {
    return request(`${this.uri}/_all/tree`, { params, method: 'GET' });
  }
}

export default Service;
