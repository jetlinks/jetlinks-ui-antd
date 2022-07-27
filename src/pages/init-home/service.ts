import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<any> {
  save = (data?: any) =>
    request(`/${SystemConst.API_BASE}/system/config/scope/_save`, {
      method: 'POST',
      data,
    });
  detail = (data?: any) =>
    request(`/${SystemConst.API_BASE}/system/config/scopes`, {
      method: 'POST',
      data,
    });
  getResourcesCurrent = () =>
    request(`${SystemConst.API_BASE}/network/resources/alive/_current`, {
      method: 'GET',
    });
  saveNetwork = (data: any) =>
    request(`${SystemConst.API_BASE}/network/config`, {
      method: 'POST',
      data,
    });
  saveProtocol = () =>
    request(`${SystemConst.API_BASE}/protocol/default-protocol/_save`, {
      method: 'POST',
    });
  getProtocol = () =>
    request(`${SystemConst.API_BASE}/protocol/_query/no-paging?paging=false`, {
      method: 'GET',
    });
  saveAccessConfig = (data: any) =>
    request(`${SystemConst.API_BASE}/gateway/device`, {
      method: 'POST',
      data,
    });
  saveProduct = (data: any) =>
    request(`${SystemConst.API_BASE}/device/product`, {
      method: 'POST',
      data,
    });
  saveDevice = (data: any) =>
    request(`${SystemConst.API_BASE}/device/instance`, {
      method: 'POST',
      data,
    });
  getPermissionAll = () =>
    request(`${SystemConst.API_BASE}/permission/_query/no-paging?paging=false`);

  // 更新全部菜单
  updateMenus = (data: any) =>
    request(`${SystemConst.API_BASE}/menu/_all`, { method: 'PATCH', data });

  // 添加角色
  addRole = (data: any) => request(`/${SystemConst.API_BASE}/role`, { method: 'POST', data });

  // 更新权限菜单
  getRoleMenu = (id: string) =>
    request(`/${SystemConst.API_BASE}/menu/role/${id}/_grant/tree`, { method: 'GET' });

  // 更新权限菜单
  updateRoleMenu = (id: string, data: any) =>
    request(`/${SystemConst.API_BASE}/menu/role/${id}/_grant`, { method: 'PUT', data });

  //  记录初始化
  saveInit = () =>
    request(`/${SystemConst.API_BASE}/user/settings/init`, {
      method: 'POST',
      data: { init: true },
    });
  //  获取初始化
  getInit = () => request(`/${SystemConst.API_BASE}/user/settings/init`, { method: 'GET' });
}

export default Service;
