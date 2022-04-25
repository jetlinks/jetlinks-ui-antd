import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<ConfigItem> {
  public getTargetTypes = () =>
    request(`/${SystemConst.API_BASE}/alarm/config/target-type/supports`, {
      method: 'GET',
    }).then((resp) => {
      return resp.result.map((item: { id: string; name: string }) => ({
        label: item.name,
        value: item.id,
      }));
    });
}

export default Service;
