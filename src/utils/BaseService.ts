import Token from '@/utils/token';
import SystemConst from '@/utils/const';
import { request } from 'umi';

interface IBaseService<T> {
  query: (params: any) => Promise<any>;
  save: (data: T) => Promise<any>;
  remove: (id: string) => Promise<any>;
}

class BaseService<T> implements IBaseService<T> {
  protected uri: string;

  protected headers = {
    'X-Access-Token': Token.get(),
  };

  constructor(uri?: string) {
    this.uri = `/${SystemConst.API_BASE}/${uri}`;
  }

  query(data: any): Promise<any> {
    return request(`${this.uri}/_query/`, { data, method: 'POST' });
  }

  queryNoPagingPost(data: any): Promise<unknown> {
    return request(`${this.uri}/_query/no-paging?paging=false`, { data, method: 'POST' });
  }

  queryNoPaging(params: any): Promise<unknown> {
    return request(`${this.uri}/_query/no-paging?paging=false`, { params, method: 'GET' });
  }

  remove(id: string): Promise<unknown> {
    return request(`${this.uri}/${id}`, { method: 'DELETE' });
  }

  save(data: Partial<T>): Promise<unknown> {
    return request(this.uri, { data, method: 'POST' });
  }

  savePatch(data: Partial<T>): Promise<unknown> {
    return request(this.uri, { data, method: 'PATCH' });
  }

  update(data: Partial<T>): Promise<any> {
    // @ts-ignore
    return data.id ? request(this.uri, { data, method: 'PATCH' }) : this.save(data);
  }

  detail(id: string): Promise<any> {
    return request(`${this.uri}/${id}`, { method: 'GET' });
  }

  modify(id: string, data: Partial<T>): Promise<any> {
    return request(`${this.uri}/${id}`, {
      method: 'PUT',
      data,
    });
  }

  getUri() {
    return this.uri;
  }
}

export default BaseService;
