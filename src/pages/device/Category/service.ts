import BaseService from '@/utils/BaseService';
import { request } from '@@/plugin-request/request';

class Service extends BaseService<CategoryItem> {
  queryTree = (params?: Record<string, any>) =>
    request(`${this.uri}/_tree`, { params, method: 'GET' });
}

export default Service;
