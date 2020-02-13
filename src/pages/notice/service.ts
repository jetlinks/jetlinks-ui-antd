import request from '@/utils/request';

export async function configType(params?: any) {
  return request(`/jetlinks/notifier/config/types`, {
    method: 'GET',
    params,
  });
}

export async function template(params?: any) {
  return request(`/jetlinks/notifier/template/_query`, {
    method: 'GET',
    params,
  });
}
export async function queryById(id: string) {
  return request(`/jetlinks/notifier/template/${id}`, {
    method: 'GET',
  });
}

export async function saveOrUpdate(item: any) {
  return request(`/jetlinks/notifier/template`, {
    method: 'PATCH',
    data: item,
  });
}

export async function remove(id: string) {
  return request(`/jetlinks/notifier/template/${id}`, {
    method: 'DELETE',
  });
}
