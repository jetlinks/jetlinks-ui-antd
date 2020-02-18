import request from '@/utils/request';
import { OrgItem } from './data.d';

export async function list(params: any) {
  return request(`/jetlinks/dimension/_query/tree`, {
    method: 'GET',
    params,
  });
}

export async function remove(id: string) {
  return request(`/jetlinks/dimension/${id}`, {
    method: 'DELETE',
  });
}

export async function add(params: OrgItem) {
  return request(`/jetlinks/dimension`, {
    method: 'POST',
    data: params,
  });
}
export async function saveOrUpdate(params: OrgItem) {
  return request(`/jetlinks/dimension/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}
