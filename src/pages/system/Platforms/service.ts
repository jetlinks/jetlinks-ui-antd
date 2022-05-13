import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<platformsType> {
  queryRoleList = (params?: any) =>
    request(`${SystemConst.API_BASE}/role/_query/no-paging?paging=false`, {
      method: 'GET',
      params,
    });

  /**
   * 密码校验
   * @param type
   * @param name
   */
  validateField = (type: 'username' | 'password', name: string) =>
    request(`/${SystemConst.API_BASE}/user/${type}/_validate`, {
      method: 'POST',
      data: name,
    });
}

export default Service;
