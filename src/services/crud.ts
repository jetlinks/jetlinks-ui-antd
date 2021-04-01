import { map, catchError } from 'rxjs/operators';
import { of, Observable, from, defer } from 'rxjs';
import { getAccessToken } from '@/utils/authority';
// import request from 'umi-request';
import { ApiResponse } from './response';
import { ajax } from 'rxjs/ajax';
import { message } from 'antd';
import request from '@/utils/request';

interface BaseServieImpl<T> {
  query(params: any): Observable<any>;
  save(params: T): Observable<any>;
  remove(id: string): Observable<any>;
  update(params: Partial<T>): Observable<any>;
}
/**
 * T 实体
 * uri 接口
 */
class BaseService<T> implements BaseServieImpl<T> {
  protected uri?: string;

  protected headers = {
    'X-Access-Token': getAccessToken(),
  };

  constructor(uri?: string) {
    this.uri = `/jetlinks/${uri}`;
  }

  public list = (params: any) =>
    defer(() =>
      from(
        request(`${this.uri}/_query/`, {
          method: 'GET',
          params,
        }),
      ),
    ).pipe(map(resp => resp.result));

  // return request(`/jetlinks/dimension/_query`, {
  //     method: 'GET',
  //     params,
  //   });
  //

  public queryNoPaging = (params: any) =>
    defer(() =>
      from(
        request(`${this.uri}/_query/no-paging?paging=false`, {
          method: 'GET',
          params,
        }),
      ),
    ).pipe(
      map(resp => resp.result),
      catchError(error => of(error)),
    );

  public query = (params: any) =>
    defer(() =>
      from(
        request(`${this.uri}/_query/`, {
          method: 'GET',
          params,
        }),
      ),
    ).pipe(
      map(resp => resp.result),
      catchError(error => of(error)),
    );

  // public query = (params: any) => ajax({
  //     url: `${this.uri}/_query/`,
  //     method: 'GET',
  //     headers: this.headers,
  //     body: params
  // }).pipe(
  //     map(resp => (resp.response as ApiResponse<T>).result),
  // );

  public save = (params: Partial<T>) =>
    defer(() =>
      from(
        request(this.uri, {
          method: 'POST',
          data: params,
        }),
      ),
    ).pipe(
      map(resp => resp.result),
      catchError(error => of(error)),
    );

  // public save = (params: Partial<T>) => ajax({
  //     url: this.uri,
  //     method: 'POST',
  //     headers: this.headers,
  //     body: JSON.stringify(params)
  // }).pipe(
  //     map(resp => (resp.response as ApiResponse<T>).result),
  //     catchError(error => of(error)));

  public remove = (id: string) =>
    defer(() =>
      request(`${this.uri}/${id}`, {
        method: 'DELETE',
      }),
    ).pipe(
      map(resp => resp.result),
      catchError(error => of(error)),
    );

  // public remove = (id: string) => ajax({
  //     url: `${this.uri}/${id}`,
  //     method: 'DELETE',
  //     headers: this.headers,
  // }).pipe(
  //     map(resp => (resp.response as ApiResponse<T>).result),
  //     catchError(error => of(error)));

  public update = (params: any) =>
    defer(() =>
      request(`${this.uri}${params.id ? '/' + params.id : '/'}`, {
        method: 'PUT',
        data: params,
      }),
    ).pipe(
      map(resp => resp.result),
      catchError(error => of(error)),
    );

  public add = (params: any) =>
    defer(() =>
      request(`${this.uri}`, {
        method: 'PATCH',
        data: params,
      }),
    ).pipe(
      map(resp => resp.result),
      catchError(error => of(error)),
    );

  // public update = (params: Partial<T>) => ajax({
  //     url: `${this.uri}/${params.id}`,
  //     method: 'PUT',
  //     headers: this.headers,
  //     body: JSON.stringify(params)
  // }).pipe(
  //     map(resp => (resp.response as ApiResponse<T>).result),
  //     catchError(error => of(error)));

  public saveOrUpdate = (params: Partial<T>) =>
    params && params.id ? this.update(params) : this.save(params);
}

export default BaseService;
