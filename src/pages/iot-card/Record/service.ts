import { request } from 'umi';
import SystemConst from '@/utils/const';
import BaseService from '@/utils/BaseService';

class Service extends BaseService<any> {
  getList = (data: any) =>
    request(`${SystemConst.API_BASE}/network/card/stateOperate/_log`, {
      method: 'POST',
      data,
    });
}
export default Service;
