import request from "@/utils/request";

export async function list(params: any) {
    return request(`/jetlinks/edge/product/_query`, {
        method: 'GET',
        params,
    });
}

export async function queryNoPagin(params?: any) {
  return request(`/jetlinks/edge/product/_query/no-paging`, {
    method: 'GET',
    params: params,
  })
}

export async function save(params: any) {
    return request(`/jetlinks/edge/product`, {
      method: 'POST',
      data: params,
    });
  }
  
  export async function update(params: any) {
    return request(`/jetlinks/edge/product`, {
      method: 'PATCH',
      data: params,
    });
  }
  
  export async function info(id: string) {
    return request(`/jetlinks/edge/product/${id}`, {
      method: 'GET',
    });
  }
  
  export async function remove(id: string) {
    return request(`/jetlinks/edge/product/${id}`, {
      method: 'DELETE',
    });
  }