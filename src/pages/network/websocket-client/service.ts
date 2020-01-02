import request from '@/utils/request';
import { WebsocketClientItem } from './data';

export async function list(params?: any) {
    return request(`/jetlinks/manager/websocket/client/_query`, {
        method: 'GET',
        params: params,
    });
}

export async function listNoPaging(params?: any) {
    return request(`/jetlinks/manager/websocket/client/_query/no-paging`, {
        method: 'GET',
        params: params,
    });
}

export async function saveOrUpdate(params: WebsocketClientItem) {
    return request(`/jetlinks/manager/websocket/client/`, {
        method: 'PATCH',
        data: params,
    });
}

export async function info(id: string) {
    return request(`/jetlinks/manager/websocket/client/${id}`, {
        method: 'GET',
    });
}


export async function remove(id: string) {
    return request(`/jetlinks/manager/websocket/client/${id}`, {
        method: 'DELETE',
    });
}
