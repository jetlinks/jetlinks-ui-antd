import { request } from '@@/plugin-request/request';
import BaseService from '@/utils/BaseService';
import type { SceneItem } from '@/pages/rule-engine/Scene/typings';

class Service extends BaseService<SceneItem> {
  start = (id: string) => request(`${this.uri}/${id}`, { methods: 'GET' });
}

export default Service;
