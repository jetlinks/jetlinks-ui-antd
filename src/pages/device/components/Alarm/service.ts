import BaseService from '@/utils/BaseService';
import { request } from '@@/plugin-request/request';
import SystemConst from '@/utils/const';

class Service extends BaseService<any> {
  public alarmList = (type: 'product' | 'device', id: string) =>
    request(`/${SystemConst.API_BASE}/device/alarm/${type}/${id}`, {
      method: 'GET',
    });

  public notifier = {
    types: () =>
      request(`/${SystemConst.API_BASE}/notifier/config/types`, {
        method: 'GET',
      }),
    config: (params: Record<string, unknown>) =>
      request(`/${SystemConst.API_BASE}/notifier/config/_query/no-paging`, {
        method: 'GET',
        params,
      }),
    template: (params: Record<string, unknown>) =>
      request(`/${SystemConst.API_BASE}/notifier/template/_query/no-paging`, {
        method: 'GET',
        params,
      }),
  };

  // 查询产品告警记录
  public record = (params: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device/alarm/history/_query`, {
      method: 'GET',
      params,
    });

  public saveAlarm = (type: 'product' | 'device', id: string, data: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device/alarm/${type}/${id}`, {
      method: 'PATCH',
      data,
    });

  public deviceDetail = (id: string) =>
    request(`/${SystemConst.API_BASE}/device/instance/${id}/detail`, {
      method: 'GET',
    });
}

export default Service;
