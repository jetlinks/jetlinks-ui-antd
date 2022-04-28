import { request } from '@@/plugin-request/request';
import BaseService from '@/utils/BaseService';
import type { SceneItem } from '@/pages/rule-engine/Scene/typings';

class Service extends BaseService<SceneItem> {
  startScene = (id: string) => request(`${this.uri}/${id}/_enable`, { method: 'PUT' });

  stopScene = (id: string) => request(`${this.uri}/${id}/_disable`, { method: 'PUT' });

  getParseTerm = (data: Record<string, any>) =>
    request(`${this.uri}/parse-term-column`, {
      method: 'POST',
      data,
    }).then((resp) => resp.result);
}

export default Service;
