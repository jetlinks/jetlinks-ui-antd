import BaseService from '@/utils/BaseService';
import type { ProductItem } from '@/pages/device/Product/typings';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<ProductItem> {
  public getOperator = () =>
    request(`/${SystemConst.API_BASE}/property-calculate-rule/description`, { method: 'GET' });
}

export default Service;
