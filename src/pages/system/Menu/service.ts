import BaseService from '@/utils/BaseService';
import { request } from '@@/plugin-request/request';
import type { MenuItem } from './typing';
import SystemConst from '@/utils/const';

class Service extends BaseService<MenuItem> {
  /**
   * 获取当前用户可访问菜单
   * @param data
   */
  queryMenuThree = (data: any) => request(`${this.uri}/_all/tree`, { method: 'POST', data });

  /**
   * 查询权限管理
   * @param data
   */
  queryPermission = (data: any) =>
    request(`${SystemConst.API_BASE}/permission/_query`, { method: 'POST', data });

  queryDetail = (id: string) => request(`${this.uri}/${id}`, { method: 'GET' });
}

export default Service;
