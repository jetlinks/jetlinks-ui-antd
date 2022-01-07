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
}

export default Service;
