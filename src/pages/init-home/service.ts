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
    request(`${SystemConst.API_BASE}/protocol/default-protocol/_query/no-paging?paging=false`, {
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
    request(`${SystemConst.API_BASE}/permission/_query/no-paging?paging=false`,);
}

export default Service;
