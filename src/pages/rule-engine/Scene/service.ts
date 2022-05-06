import { request } from '@@/plugin-request/request';
import BaseService from '@/utils/BaseService';
import type { SceneItem } from '@/pages/rule-engine/Scene/typings';
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
  // getParseTerm = (data: Record<string, any>) => {
  //   const oldParams = Store.get('request-params-parse-term');
  //   const list = Store.get('parse-term');
  //   const f = list && _.isEqual(oldParams, data);
  //   console.log(oldParams, list, f, data, 'request');
  //   return f ? new Promise(resolve => {
  //     resolve(list);
  //   }) : request(`${this.uri}/parse-term-column`, {
  //     method: 'POST',
  //     data,
  //   }).then((resp) => {
  //     Store.set('parse-term', resp.result);
  //     console.log(Store.get('parse-term'), 'then-resp')
  //     return resp.result
  //   }).finally(() => {
  //     Store.set('request-params-parse-term', data);
  //   });
  // };

  // private cacheTerm$: Promise<any> | undefined;

  // getParseTerm = (data: Record<string, any>) => {
  //   if (!this.cacheTerm$) {
  //     this.cacheTerm$ = lastValueFrom(
  //       defer(() =>
  //         from(
  //           request(`${this.uri}/parse-term-column`, {
  //             method: 'POST',
  //             data,
  //           }),
  //         ),
  //       ).pipe(
  //         filter((item) => item.status === 200),
  //         map((item) => {
  //           return item.result;
  //         }),
  //         // shareReplay(1, 100),
  //       ),
  //     );
  //   }
  //   return this.cacheTerm$;
  // };
}

export default Service;
