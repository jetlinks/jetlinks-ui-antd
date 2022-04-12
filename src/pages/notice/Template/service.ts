import BaseService from '@/utils/BaseService';
import {request} from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<TemplateItem> {
  public getTypes = () =>
    request(`/${SystemConst.API_BASE}/notifier/config/types`, {
      method: 'GET',
    });

  public getMetadata = (type: string, provider: string) =>
    request(`${this.uri}/${type}/${provider}/metadata`, {
      method: 'GET',
    });

  public batchInsert = (data: Record<any, any>[]) =>
    request(`${this.uri}/_batch`, {
      method: 'POST',
      data
    });

  public getConfigs = (data: any) =>
    request(`${SystemConst.API_BASE}/notifier/config/_query`, {
      method: 'POST',
      data,
    });

  public getHistoryLog = (templateId: string, data: Record<string, any>) =>
    request(`${SystemConst.API_BASE}/notify/history/template/${templateId}/_query`, {
      method: 'POST',
      data
    });

  public debug = (id: string, data: Record<string, any>) =>
    request(`${SystemConst.API_BASE}/notifier/${id}/_send`, {
      method: 'POST',
      data
    })

  public sendMessage = (notifierId: string) =>
    request(`${SystemConst.API_BASE}/notifier/${notifierId}/_send`, {
      method: 'POST',
    });

  dingTalk = {
    getDepartments: (id: string) =>
      request(`${SystemConst.API_BASE}/notifier/dingtalk/corp/${id}/departments`),
    getDepartmentsTree: (id: string) =>
      request(`${SystemConst.API_BASE}/notifier/dingtalk/corp/${id}/departments/tree`),
    getUserByDepartment: (id: string, departmentId: string) =>
      request(`${SystemConst.API_BASE}/notifier/dingtalk/corp/${id}/${departmentId}/users`),
  };

  weixin = {
    getTags: (id: string) => request(`${SystemConst.API_BASE}/notifier/wechat/corp/${id}/tags`),
    getDepartments: (id: string) =>
      request(`${SystemConst.API_BASE}/notifier/wechat/corp/${id}/departments`),
    getUserByDepartment: (id: string) =>
      request(`${SystemConst.API_BASE}/notifier/wechat/corp/${id}/users`),
  };

  aliyun = {
    getSigns: (id: string) => request(`${SystemConst.API_BASE}/notifier/sms/aliyun/${id}/signs`),
    getTemplates: (id: string) =>
      request(`${SystemConst.API_BASE}/notifier/sms/aliyun/${id}/templates`),
  };
}

export default Service;
