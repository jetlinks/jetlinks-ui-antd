import request from '@/utils/request';
import Service from '@/services/crud';
import { from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RoleItem } from './data';
import { ApiResponse } from '@/services/response';

class RoleService<T> extends Service<T> {
  public bindUser = (params: any) =>
    from(
      request(`/jetlinks/dimension-user/_query/no-paging`, {
        method: 'GET',
        params,
      }),
    ).pipe(
      map(
        (response: ApiResponse<T>) => response,
        catchError(error => of(error)),
      ),
    );

  public unBindUser = (id: string) =>
    from(
      request(`/jetlinks/dimension-user/${id}`, {
        method: 'DELETE',
      }),
    ).pipe(
      map(
        (response: ApiResponse<T>) => response,
        catchError(error => of(error)),
      ),
    );

  public bind = (params: any) =>
    from(
      request(`/jetlinks/dimension-user`, {
        method: 'POST',
        data: params,
      }),
    ).pipe(
      map(
        (response: ApiResponse<T>) => response,
        catchError(error => of(error)),
      ),
    );
}

export default RoleService;
export async function bindUser(params: any) {
  return request(`/jetlinks/dimension-user/_query/no-paging`, {
    method: 'GET',
    params,
  });
}
export async function unBindUser(id: string, data: any) {
  return request(`/jetlinks/dimension-user/user/role/${id}/_unbind`, {
    method: 'POST',
    data,
  });
}

export async function bind(params: any) {
  return request(`/jetlinks/dimension-user`, {
    method: 'POST',
    data: params,
  });
}

export async function list(params: any) {
  return request(`/jetlinks/dimension/_query`, {
    method: 'GET',
    params,
  });
}

export async function remove(id: string) {
  return request(`/jetlinks/dimension/${id}`, {
    method: 'DELETE',
  });
}

export async function add(params: RoleItem) {
  return request(`/jetlinks/dimension`, {
    method: 'POST',
    data: params,
  });
}
export async function save(params: RoleItem) {
  return request(`/jetlinks/dimension`, {
    method: 'POST',
    data: params,
  });
}

export async function saveOrUpdate(params: RoleItem) {
  return request(`/jetlinks/dimension`, {
    method: 'PATCH',
    data: params,
  });
}
