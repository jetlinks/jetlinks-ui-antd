import BaseService from '@/utils/BaseService';
import { request } from '@@/plugin-request/request';
import SystemConst from '@/utils/const';
import type { FirmwareItem } from '@/pages/device/Firmware/typings';

class Service extends BaseService<FirmwareItem> {
  task = (params: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/firmware/upgrade/task/_query`, {
      method: 'GET',
      params,
    });

  history = (params: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/firmware/upgrade/history/_query`, {
      method: 'GET',
      params,
    });
}

export default Service;
