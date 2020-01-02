import request from '@/utils/request';
import { UserItem } from './data';

export async function list(params?: any) {
  return request(`/jetlinks/user/_query`, {
    method: 'GET',
    params: params,
  });
}

export async function listNoPaging(params?: any) {
  return request(`/jetlinks/user/_query/no-paging`, {
    method: 'GET',
    params: params,
  });
}

export async function saveOrUpdate(params: UserItem) {
  return request(`/jetlinks/user/`, {
    method: 'PATCH',
    data: params,
  });
}

export async function info(id: string) {
  return request(`/jetlinks/user/${id}`, {
    method: 'GET',
  });
}


export async function remove(id: string) {
  return request(`/jetlinks/user/${id}`, {
    method: 'DELETE',
  });
}


//=================================
export async function queryById(id: string) {
  return request(`/hsweb/user/${id}`, {
    method: 'GET',
  });
}


export async function add(params: UserItem) {
  return request(`/hsweb/user`, {
    method: 'POST',
    data: params,
  });
}

export async function update(params: UserItem) {
  return request(`/hsweb/user/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}
