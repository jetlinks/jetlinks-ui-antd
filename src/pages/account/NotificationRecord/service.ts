import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<NotifitionRecord> {
  public queryList = (data?: any) =>
    request(`/${SystemConst.API_BASE}/notifications/_query`, {
      method: 'GET',
      params: data,
    });

  public saveData = (state: string, data?: any) =>
    request(`/${SystemConst.API_BASE}/notifications/_${state}`, {
      method: 'POST',
      data,
    });

  public getAlarmList = (id: string, data?: any) =>
    request(`/${SystemConst.API_BASE}/alarm/record/${id}`, {
      method: 'GET',
      params: data,
    });

  public getProvidersList = (params?: any) =>
    request(`/${SystemConst.API_BASE}/notifications/providers`, {
      method: 'GET',
      params,
    }).then((resp: any) => {
      return (resp?.result || []).map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    });
}

export default Service;
