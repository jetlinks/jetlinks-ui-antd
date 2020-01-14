import request from '@/utils/request';

export async function list(params?: any) {
    return request(`/jetlinks/network/config/_query/no-paging`, {
        method: 'GET',
        params: params
    })
}

export async function save(params?: any) {
    return request(`/jetlinks/network/config/`, {
        method: 'POST',
        data: params
    })
}

export async function remove(id: string) {
    return request(`/jetlinks/network/config/${id}`, {
        method: 'DELETE'
    })
}