import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<UserItem> {
  queryRoleList = (params?: any) =>
    request(`${SystemConst.API_BASE}/role/_query/no-paging?paging=false`, {
      method: 'GET',
      params,
    });

  queryOrgList = (params?: any) =>
    request(`${SystemConst.API_BASE}/organization/_all/tree`, {
      method: 'GET',
      params,
    });

  queryDetailList = (data?: any) =>
    request(`${SystemConst.API_BASE}/user/detail/_query`, {
      method: 'POST',
      data,
    });

  queryDetail = (id: string) =>
    request(`/${SystemConst.API_BASE}/user/detail/${id}`, {
      method: 'GET',
    });

  saveUser = (data: UserItem, type: 'add' | 'edit' | 'query') => {
    const map = {
      add: {
        api: '_create',
        method: 'POST',
      },
      edit: {
        api: `${data.id}/_update`,
        method: 'PUT',
      },
    };
    return request(`/${SystemConst.API_BASE}/user/detail/${map[type].api}`, {
      method: map[type].method,
      data,
    });
  };

  validateField = (type: 'username' | 'password', name: string) =>
    request(`/${SystemConst.API_BASE}/user/${type}/_validate`, {
      method: 'POST',
      data: name,
    });

  resetPassword = (id: string, password: string) =>
    request(`/${SystemConst.API_BASE}/user/${id}/password/_reset`, {
      method: 'POST',
      data: password,
    });
}

export default Service;
