import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service {
  private api = `/${SystemConst.API_BASE}/user/settings`;

  public history = {
    query: (type: string) =>
      request(`${this.api}/${type}`, {
        method: 'GET',
      }),
    save: (type: string, data: Record<string, unknown>) =>
      request(`${this.api}/${type}`, {
        method: 'POST',
        data,
      }),
    remove: (type: string, key: string) =>
      request(`${this.api}/${type}/${key}`, {
        method: 'DELETE',
      }),
  };
}

export default Service;
