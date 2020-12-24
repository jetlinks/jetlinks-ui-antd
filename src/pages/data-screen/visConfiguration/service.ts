import request from '@/utils/request';

export async function query(params: any) {
  return request(`/jetlinks/vis_configuration/_query`, {
    method: 'GET',
    params,
  })
}

export async function update(id: string, params: any) {
  return request(`/jetlinks/configuration/${id}`, {
    method: 'PUT',
    data: params,
  })
}


export async function save(params: any) {
  return request(`/jetlinks/configuration`, {
    method: 'POST',
    data: params,
  })
}

export async function remove(id: any) {
  return request(`/jetlinks/vis_configuration/${id}`, {
    method: 'DELETE'
  })
}

//获取跳转地址
export async function getUrl() {
  return request('/jetlinks/system/apis', {
    method: 'GET'
  })
}

