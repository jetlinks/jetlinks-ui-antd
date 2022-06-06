import { request } from '@@/plugin-request/request';
import SystemConst from '@/utils/const';

class Service {
  dashboard = (data: Record<string, any>[]) =>
    request(`/${SystemConst.API_BASE}/dashboard/_multi`, {
      method: 'POST',
      data,
    });

  getAlarm = (params: Record<string, any>) =>
    request(`/${SystemConst.API_BASE}/alarm/record/_query`, {
      method: 'GET',
      params,
    });

  getAlarmConfigCount = (data: Record<string, any>) =>
    request(`/${SystemConst.API_BASE}/alarm/config/_count`, {
      method: 'POST',
      data,
    });

  getAlarmLevel = () =>
    request(`/${SystemConst.API_BASE}/alarm/config/default/level`, {
      method: 'GET',
    });
}

export default Service;
