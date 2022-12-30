import { request } from '@@/plugin-request/request';
import BaseService from '@/utils/BaseService';
import type { SceneItem } from '@/pages/rule-engine/Scene/typings';
import SystemConst from '@/utils/const';
// import { defer, from, lastValueFrom, shareReplay } from 'rxjs';
// import { filter, map } from 'rxjs/operators';

class Service extends BaseService<SceneItem> {
  startScene = (id: string) => request(`${this.uri}/${id}/_enable`, { method: 'PUT' });

  stopScene = (id: string) => request(`${this.uri}/${id}/_disable`, { method: 'PUT' });

  updateScene = (data: any) => request(`${this.uri}/${data.id}`, { method: 'PUT', data });

  getParseTerm = (data: Record<string, any>) =>
    request(`${this.uri}/parse-term-column`, {
      method: 'POST',
      data,
    }).then((resp) => resp.result);

  sceneByAlarm = (id: string) =>
    request(`${SystemConst.API_BASE}/alarm/config/_query`, {
      method: 'POST',
      data: { terms: [{ column: 'id', value: id, termType: 'rule-bind-alarm' }] },
    });
  _execute = (id: string) =>
    request(`/${SystemConst.API_BASE}/scene/${id}/_execute`, {
      method: 'POST',
      data: {},
    });
}

export default Service;
