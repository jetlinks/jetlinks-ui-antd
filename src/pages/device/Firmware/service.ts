import BaseService from '@/utils/BaseService';
import { request } from '@@/plugin-request/request';
import SystemConst from '@/utils/const';
import type { FirmwareItem } from '@/pages/device/Firmware/typings';

class Service extends BaseService<FirmwareItem> {
  task = (params: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/firmware/upgrade/task/_query`, {
      method: 'POST',
      data: params,
    });

  saveTask = (data: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/firmware/upgrade/task`, {
      method: 'POST',
      data,
    });

  deploy = (id: string, type?: 'all' | 'part', deviceId?: string[]) =>
    request(
      `/${SystemConst.API_BASE}/firmware/upgrade/task/${id}${type === 'all' ? '/all' : ''}/_deploy`,
      {
        method: 'POST',
        data: deviceId,
      },
    );

  history = (params: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/firmware/upgrade/history/_query`, {
      method: 'GET',
      params,
    });

  historyCount = (params: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/firmware/upgrade/history/_count`, {
      method: 'GET',
      params,
    });

  queryProduct = () =>
    request(`/${SystemConst.API_BASE}/device/product/_query/no-paging?paging=false`);

  queryDevice = () =>
    request(`/${SystemConst.API_BASE}/device/instance/_query/no-paging?paging=false`);
}

export default Service;
