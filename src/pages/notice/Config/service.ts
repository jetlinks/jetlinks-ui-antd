import BaseService from '@/utils/BaseService';
import {request} from 'umi';
import SystemConst from '@/utils/const';

class Service extends BaseService<ConfigItem> {
  public getTypes = () =>
    request(`${this.uri}/types`, {
      method: 'GET',
    });

  public getMetadata = (type: string, provider: string) =>
    request(`${this.uri}/${type}/${provider}/metadata`, {
      method: 'GET',
    });

  public getTemplate = (configId: string, data: Record<string, any>) =>
    request(`${SystemConst.API_BASE}/notifier/template/${configId}/_query`, {
      method: 'POST',
      data
    });

  public getTemplateVariable = (templateId: string) =>
    request(`${SystemConst.API_BASE}/notifier/template/${templateId}/detail`);

  public getHistoryLog = (configId: string, data: Record<string, any>) =>
    request(`${SystemConst.API_BASE}/notify/history/config/${configId}/_query`, {
      method: 'POST',
      data
    });

  public debug = (id: string, data: Record<string, any>) =>
    request(`${SystemConst.API_BASE}/notifier/${id}/_send`, {
      method: 'POST',
      data
    })

}

export default Service;
