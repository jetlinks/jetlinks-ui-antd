import request from '@/utils/request';

export async function list(params?: any) {
  return request(`/jetlinks/unicomCmp/_query`, {
    method: 'GET',
    params,
  });
}

export async function listNoPaging(params?: any) {
  return request(`/jetlinks/unicomCmp/_query/no-paging`, {
    method: 'GET',
    params,
  });
}

// 根据ID删除
export async function remove(id: string) {
  return request(`/jetlinks/unicomCmp/${id}`, {
    method: 'DELETE',
  });
}

// 新增单个数据,并返回新增后的数据.
export async function saveData(params: any) {
  return request(`/jetlinks/unicomCmp`, {
    method: 'POST',
    data: params
  });
}

// 根据ID修改数据
export async function save(id: string, params: any) {
  return request(`/jetlinks/unicomCmp/${id}`, {
    method: 'PUT',
    data: params
  });
}
