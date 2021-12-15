import BaseService from '@/utils/BaseService';
import { request } from '@@/plugin-request/request';
import type { CommandItem } from '@/pages/device/Command/typings';
import SystemConst from '@/utils/const';

class Service extends BaseService<CommandItem> {
  queryProduct = () =>
    request(`/${SystemConst.API_BASE}/device/product/_query/no-paging?paging=false`);

  task = (data: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device/message/task`, {
      method: 'POST',
      data,
    });

  resend = (data: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device/message/task/state/wait`, {
      method: 'PUT',
      data,
    });
}

export default Service;
