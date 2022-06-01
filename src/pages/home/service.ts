import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service {
  public queryView = () =>
    request(`/${SystemConst.API_BASE}/user/settings/view`, {
      method: 'GET',
    });

  public setView = (data: Record<string, any>) =>
    request(`/${SystemConst.API_BASE}/user/settings/view`, {
      method: 'POST',
      data,
    });
}

export default Service;
