import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<API.NoticeIconItem> {
  public fetchNotices = (params?: any) =>
    request(`/${SystemConst.API_BASE}/notifications/_query`, {
      method: 'GET',
      params,
    });

  public clearNotices = (data?: any[]) =>
    request(`/${SystemConst.API_BASE}/notifications/_read`, {
      method: 'POST',
      data,
    });

  public changeNoticeReadState = (id: string) =>
    request(`/${SystemConst.API_BASE}/notifications/${id}/read`, {
      method: 'GET',
    });
}

export default Service;
