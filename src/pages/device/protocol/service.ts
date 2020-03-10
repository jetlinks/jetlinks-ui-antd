import request from '@/utils/request';
import { ProtocolItem } from './data';

export async function list(params?: any) {
    return request(`/jetlinks/protocol/_query`, {
        method: 'GET',
        params: params,
    });
}

export async function listNoPaging(params?: any) {
    return request(`/jetlinks/protocol/_query/no-paging`, {
        method: 'GET',
        params: params,
    });
}

export async function saveOrUpdate(params: ProtocolItem) {
    return request(`/jetlinks/protocol/`, {
        method: 'PATCH',
        data: params,
    });
}

export async function info(id: string) {
    return request(`/jetlinks/protocol/${id}`, {
        method: 'GET',
    });
}


export async function remove(id: string) {
    return request(`/jetlinks/protocol/${id}`, {
        method: 'DELETE',
    });
}

export async function changeDeploy(payload: any) {
    return request(`/jetlinks/protocol/${payload.id}/${payload.type}`, {
        method: 'POST',
    })
}

export async function convert(data: any) {
    return request(`/jetlinks/protocol/convert`, {
        method: 'POST',
        data
    });
}

export async function optionCode(type: 'decode' | 'encode', data: any) {
    return request(`/jetlinks/protocol/${type}`, {
        method: 'POST',
        data
    });
}

export async function providers() {
    return request(`/jetlinks/protocol/providers`, {
        method: 'GET'
    })
}