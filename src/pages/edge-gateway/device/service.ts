import request from "@/utils/request";

export async function list(params: any) {
    return request(`/jetlinks/device/instance/_query`, {
        method: 'GET',
        params,
    });
}
export async function save(params: any) {
    return request(`/jetlinks/device-instance`, {
      method: 'POST',
      data: params,
    });
  }
  
  export async function update(params: any) {
    return request(`/jetlinks/device-instance`, {
      method: 'PATCH',
      data: params,
    });
  }
  
  export async function info(id: string) {
    return request(`/jetlinks/device/instance/${id}/detail`, {
      method: 'GET',
    });
  }
  
  export async function remove(id: string) {
    return request(`/jetlinks/device-instance/${id}`, {
      method: 'DELETE',
    });
  }