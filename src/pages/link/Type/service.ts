import type { NetworkItem } from '@/pages/link/Type/typings';
import { request } from 'umi';
import BaseService from '@/utils/BaseService';
import SystemConst from '@/utils/const';

class Service extends BaseService<NetworkItem> {
  public _start = (id: string) =>
    request(`/${SystemConst.API_BASE}/network/config/${id}/_start`, {
      method: 'POST',
    });

  public _shutdown = (id: string) =>
    request(`/${SystemConst.API_BASE}/network/config/${id}/_shutdown`, {
      method: 'POST',
    });
}

export default Service;
