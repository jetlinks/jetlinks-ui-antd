import request from '@/utils/request';
import { AccessLoggerItem } from './data';

export async function list(params?: any) {
    return request(`/jetlinks/logger/access/_query`, {
        method: 'GET',
        params: params,
    });
}

export async function listNoPaging(params?: any) {
    return request(`/jetlinks/logger/access/_query/no-paging`, {
        method: 'GET',
        params: params,
    });
}

export async function saveOrUpdate(params: AccessLoggerItem) {
    return request(`/jetlinks/logger/access/`, {
        method: 'PATCH',
        data: params,
    });
}

export async function info(id: string) {
    return request(`/jetlinks/logger/access/${id}`, {
        method: 'GET',
    });
}


export async function remove(id: string) {
    return request(`/jetlinks/logger/access/${id}`, {
        method: 'DELETE',
    });
}
