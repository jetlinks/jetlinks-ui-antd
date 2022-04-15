import BaseService from '@/utils/BaseService';
import { request } from 'umi';
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
      data,
    });

  public getConfigs = (data: any) =>
    request(`${SystemConst.API_BASE}/notifier/config/_query`, {
      method: 'POST',
      data,
    });

  public getHistoryLog = (templateId: string, data: Record<string, any>) =>
    request(`${SystemConst.API_BASE}/notify/history/template/${templateId}/_query`, {
      method: 'POST',
      data,
    });

  public debug = (id: string, data: Record<string, any>) =>
    request(`${SystemConst.API_BASE}/notifier/${id}/_send`, {
      method: 'POST',
      data,
    });

  public sendMessage = (notifierId: string) =>
    request(`${SystemConst.API_BASE}/notifier/${notifierId}/_send`, {
      method: 'POST',
    });

  dingTalk = {
    getDepartments: (id: string) =>
      request(`${SystemConst.API_BASE}/notifier/dingtalk/corp/${id}/departments`).then(
        (resp: any) => {
          return resp.result?.map((item: any) => ({
            label: item.name,
            value: item.id,
          }));
        },
      ),
    getDepartmentsTree: (id: string) =>
      request(`${SystemConst.API_BASE}/notifier/dingtalk/corp/${id}/departments/tree`).then(
        (resp: any) => {
          return resp.result?.map((item: any) => ({
            label: item.name,
            value: item.id,
          }));
        },
      ),
    getUser: (id: string) =>
      request(`${SystemConst.API_BASE}/notifier/dingtalk/corp/${id}/users`).then((resp: any) => {
        return resp.result?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
      }),
  };

  weixin = {
    getTags: (id: string) =>
      request(`${SystemConst.API_BASE}/notifier/wechat/corp/${id}/tags`).then((resp: any) => {
        return resp.result?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
      }),
    getDepartments: (id: string) =>
      request(`${SystemConst.API_BASE}/notifier/wechat/corp/${id}/departments`).then(
        (resp: any) => {
          return resp.result?.map((item: any) => ({
            label: item.name,
            value: item.id,
          }));
        },
      ),
    getUser: (id: string) =>
      request(`${SystemConst.API_BASE}/notifier/wechat/corp/${id}/users`).then((resp: any) => {
        return resp.result?.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
      }),
    getOfficialTags: (configId: string) =>
      request(`${SystemConst.API_BASE}/notifier/wechat/official/${configId}/tags`).then(
        (resp: any) => {
          return resp.result?.map((item: any) => ({
            label: item.name,
            value: item.id,
          }));
        },
      ),
    getOfficialTemplates: (configId: string) =>
      request(`${SystemConst.API_BASE}/notifier/wechat/official/${configId}/templates`).then(
        (resp: any) => {
          return resp.result?.map((item: any) => ({
            ...item,
            label: item.title,
            value: item.id,
          }));
        },
      ),
  };

  aliyun = {
    getSigns: (id: string) =>
      request(`${SystemConst.API_BASE}/notifier/sms/aliyun/${id}/signs`).then((resp: any) => {
        return resp.result?.map((item: any) => ({
          ...item,
          label: item.signName,
          value: item.signName,
        }));
      }),
    getTemplates: (id: string) =>
      request(`${SystemConst.API_BASE}/notifier/sms/aliyun/${id}/templates`).then((resp: any) => {
        return resp.result?.map((item: any) => ({
          ...item,
          label: item.templateName,
          value: item.templateCode,
        }));
      }),
  };
}

export default Service;
