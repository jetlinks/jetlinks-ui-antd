import request from '@/utils/request';
import { OpcUaItem } from './data';

export async function list(params?: any) {
    return request(`/jetlinks/opc/client/_query`, {
        method: 'GET',
        params: params,
    });
}

export async function listNoPaging(params?: any) {
    return request(`/jetlinks/opc/client/_query/no-paging`, {
        method: 'GET',
        params: params,
    });
}

export async function save(params: OpcUaItem) {
    return request(`/jetlinks/opc/client`, {
        method: 'POST',
        data: params,
    });
}

export async function updata(params: OpcUaItem) {
    return request(`/jetlinks/opc/client/${params.id}`, {
        method: 'PUT',
        data: params,
    });
}

export async function remove(id: string) {
    return request(`/jetlinks/opc/client/${id}`, {
        method: 'DELETE',
    });
}

export async function start(id: string) {
    return request(`/jetlinks/opc/client/${id}/_enable`, {
        method: 'POST',
    });
}

export async function stop(id: string) {
    return request(`/jetlinks/opc/client/${id}/_disable`, {
        method: 'POST',
    });
}
