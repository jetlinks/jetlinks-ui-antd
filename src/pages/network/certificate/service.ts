import request from '@/utils/request';
// import { MqttItem } from './data';

export async function list(params?: any) {
  return request(`/jetlinks/network/certificate/_query`, {
    method: 'GET',
    params,
  });
}

export async function listNoPaging(params?: any) {
  return request(`/jetlinks/network/certificate/_query/no-paging`, {
    method: 'GET',
    params,
  });
}

export async function saveOrUpdate(params: any) {
  return request(`/jetlinks/network/certificate/`, {
    method: 'PATCH',
    data: params,
  });
}

export async function info() {
  return request(`/jetlinks/network/certificate`, {
    method: 'GET',
  });
}

export async function remove(id: string) {
  return request(`/jetlinks/network/certificate/${id}`, {
    method: 'DELETE',
  });
}
