// import request from "@/utils/request";
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

  query(params: any): Promise<any> {
    return request(`${this.uri}/_query/`, { params, method: 'GET' });
  }

  queryNoPaging(params: any): Promise<any> {
    return request(`${this.uri}/_query/no-paging?paging=false`, { params, method: 'GET' });
  }

  remove(id: string): Promise<any> {
    return request(`${this.uri}/${id}`, { method: 'DELETE' });
  }

  save(data: T): Promise<any> {
    return request(this.uri, { data, method: 'POST' });
  }

  update(data: Partial<T>): Promise<any> {
    return request(this.uri, { data, method: 'PATCH' });
  }
}

export default BaseService;
