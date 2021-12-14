import BaseService from '@/utils/BaseService';
import { request } from '@@/plugin-request/request';
import type { CommandItem } from '@/pages/device/Command/typings';
import SystemConst from '@/utils/const';

class Service extends BaseService<CommandItem> {
  queryProduct = () =>
    request(`/${SystemConst.API_BASE}/device/product/_query/no-paging?paging=false`);
}

export default Service;
