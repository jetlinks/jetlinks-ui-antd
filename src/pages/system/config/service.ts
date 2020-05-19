import request from "@/utils/request";

export async function list() {
    return request(`/jetlinks/system/config/front`, {
        method: 'GET',
    });
}


export async function add(params: any) {
    return request(`/jetlinks/system/config/front`, {
        method: 'POST',
        data: params,
    })
}
export async function update(params: any) {
    return request(`/jetlinks/system/config/front`, {
        method: 'POST',
        data: params,
    })
}
