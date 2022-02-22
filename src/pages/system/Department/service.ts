import BaseService from '@/utils/BaseService';
import type { DepartmentItem } from '@/pages/system/Department/typings';
import { request } from '@@/plugin-request/request';

class Service extends BaseService<DepartmentItem> {
  // 根据ID查询部门
  queryOrgThree = (params: any) =>
    request(`${this.uri}/_all/tree`, { method: 'POST', data: params });
}

export default Service;
