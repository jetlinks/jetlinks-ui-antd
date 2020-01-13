import request from '@/utils/request';

export async function list(params?: any) {
    return request(`/jetlinks/network/config/_query`, {
        method: 'GET',
        params: params
    })
}