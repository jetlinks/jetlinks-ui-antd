import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';
import { DuerOSItem } from '@/pages/Northbound/DuerOS/types';

class Service extends BaseService<DuerOSItem> {
  public getTypes = () =>
    request(`${this.uri}/types`, {
      method: 'GET',
    });

  public getProduct = () =>
    request(`/${SystemConst.API_BASE}/device-product/_query/no-paging`, {
      method: 'POST',
      data: {
        paging: false,
      },
    });
}

export default Service;
