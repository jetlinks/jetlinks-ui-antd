import request from '@/utils/request';
import { OrgItem } from './data.d';

export async function list(params: any) {
  return request(`/jetlinks/organization/_all/tree`, {
    method: 'GET',
    params,
  });
}

export async function remove(id: string) {
  return request(`/jetlinks/organization/${id}`, {
    method: 'DELETE',
  });
}

export async function add(params: OrgItem) {
  return request(`/jetlinks/organization`, {
    method: 'PATCH',
    data: params,
  });
}
export async function saveOrUpdate(params: OrgItem) {
  return request(`/jetlinks/organization/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function bindUser(params: any) {
  return request(`/jetlinks/dimension-user/_query/no-paging`, {
    method: 'GET',
    params,
  });
}

export async function unBindUser(id: string) {
  return request(`/jetlinks/dimension-user/${id}`, {
    method: 'DELETE',
  });
}

export async function unBindUserList(id: string, params: any) {
  return request(`/jetlinks/organization/${id}/users/_unbind `, {
    method: 'POST',
    data: params,
  });
}

export async function bind(params: any) {
  return request(`/jetlinks/dimension-user`, {
    method: 'PATCH',
    data: params,
  });
}

export async function bindUserList(id: string, params: any) {
  return request(`/jetlinks/organization/${id}/users/_bind `, {
    method: 'POST',
    data: params,
  });
}
