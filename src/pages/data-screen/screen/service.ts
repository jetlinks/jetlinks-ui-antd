import request from '@/utils/request';

export async function query(params: any) {
  return request(`/jetlinks/visualization/_query`, {
    method: 'GET',
    params,
  })
}

export async function update(id: string, params: any) {
  return request(`/jetlinks/visualization/${id}`, {
    method: 'PUT',
    data: params,
  })
}


export async function save(params: any) {
  return request(`/jetlinks/visualization`, {
    method: 'POST',
    data: params,
  })
}

export async function remove(id: any) {
  return request(`/jetlinks/visualization/${id}`, {
    method: 'DELETE'
  })
}

