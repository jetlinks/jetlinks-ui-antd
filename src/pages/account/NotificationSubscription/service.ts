import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<NotifitionSubscriptionItem> {
  //
  public saveData = (data?: any) =>
    request(`/${SystemConst.API_BASE}/notifications/subscribe`, {
      method: 'PATCH',
      data,
    });

  public _enabled = (id: string, data?: any) =>
    request(`/${SystemConst.API_BASE}/notifications/subscription/${id}/_enabled`, {
      method: 'PUT',
      data,
    });

  public _disabled = (id: string, data?: any) =>
    request(`/${SystemConst.API_BASE}/notifications/subscription/${id}/_disabled`, {
      method: 'PUT',
      data,
    });

  public remove = (id: string) =>
    request(`/${SystemConst.API_BASE}/notifications/subscription/${id}`, {
      method: 'DELETE',
    });
  // 获取订阅类型
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

  // 获取告警配置
  public getAlarmConfigList = () =>
    request(`/${SystemConst.API_BASE}/alarm/config/_query/no-paging`, {
      method: 'POST',
      data: {
        paging: false,
      },
    }).then((resp: any) => {
      return (resp?.result || []).map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
    });
}

export default Service;
