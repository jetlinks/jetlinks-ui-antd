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
   * 当前用户权限菜单
   * @param data
   */
  queryOwnThree = (data: any) => request(`${this.uri}/user-own/tree`, { method: 'POST', data });

  /**
   * 查询权限管理
   * @param data
   */
  queryPermission = (data: any) =>
    request(`${SystemConst.API_BASE}/permission/_query/no-paging`, { method: 'POST', data });

  queryDetail = (id: string) => request(`${this.uri}/${id}`, { method: 'GET' });

  // 资产类型
  queryAssetsType = () => request(`${SystemConst.API_BASE}/asset/types`, { method: 'GET' });

  // 更新全部菜单
  updateMenus = (data: any) => request(`${this.uri}/_all`, { method: 'PATCH', data });

  getSystemPermission = () =>
    request(`${SystemConst.API_BASE}/system/resources/permission`, {
      method: 'GET',
    });
}

export default Service;
