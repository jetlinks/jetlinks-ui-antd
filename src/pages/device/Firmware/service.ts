import BaseService from '@/utils/BaseService';
import { request } from '@@/plugin-request/request';
import SystemConst from '@/utils/const';
import type { FirmwareItem } from '@/pages/device/Firmware/typings';

class Service extends BaseService<FirmwareItem> {
  querySystemApi = () =>
    request(`/${SystemConst.API_BASE}/system/apis`, {
      method: 'GET',
    });

  task = (params: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/firmware/upgrade/task/detail/_query`, {
      method: 'POST',
      data: params,
    });

  saveTask = (data: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/firmware/upgrade/task`, {
      method: 'POST',
      data,
    });

  deleteTask = (id: string) =>
    request(`/${SystemConst.API_BASE}/firmware/upgrade/task/${id}`, {
      method: 'DELETE',
    });

  history = (params: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/firmware/upgrade/history/_query`, {
      method: 'POST',
      data: params,
    });

  historyCount = (params: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/firmware/upgrade/history/_count`, {
      method: 'POST',
      data: params,
    });

  startTask = (id: string, params: string[]) =>
    request(`/${SystemConst.API_BASE}/firmware/upgrade/task/${id}/_start`, {
      method: 'POST',
      data: params,
    });

  stopTask = (id: string) =>
    request(`/${SystemConst.API_BASE}/firmware/upgrade/task/${id}/_stop`, {
      method: 'POST',
    });

  startOneTask = (params: string[]) =>
    request(`/${SystemConst.API_BASE}/firmware/upgrade/task/_start`, {
      method: 'POST',
      data: params,
    });

  queryProduct = (params?: any) =>
    request(`/${SystemConst.API_BASE}/device-product/detail/_query/no-paging`, {
      method: 'POST',
      data: params,
    });

  queryDevice = () =>
    request(`/${SystemConst.API_BASE}/device/instance/_query/no-paging?paging=false`);
}

export default Service;
