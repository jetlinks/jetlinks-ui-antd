import request from '@/utils/request';

export async function list(params?: any) {
    return request(`/jetlinks/network/config/_query/no-paging`, {
        method: 'GET',
        params: params
    })
}

export async function save(params?: any) {
    return request(`/jetlinks/network/config/`, {
        method: 'PATCH',
        data: params
    })
}

export async function remove(id: string) {
    return request(`/jetlinks/network/config/${id}`, {
        method: 'DELETE'
    })
}

export async function support() {
    return request(`/jetlinks/network/config/supports`, {
        method: 'GET'
    })
}

export async function changeStatus(id: string, type: string) {
    return request(`/jetlinks/network/config/${id}/${type}`, {
        method: 'POST'
    });
}
