import request from '@/utils/request';
import { EmailItem } from './data';

export async function list(params?: any) {
    return request(`/jetlinks/email-sender/_query`, {
        method: 'GET',
        params: params,
    });
}

export async function listNoPaging(params?: any) {
    return request(`/jetlinks/email-sender/_query/no-paging`, {
        method: 'GET',
        params: params,
    });
}

export async function saveOrUpdate(params: EmailItem) {
    return request(`/jetlinks/email-sender/`, {
        method: 'PATCH',
        data: params,
    });
}

export async function info(id: string) {
    return request(`/jetlinks/email-sender/${id}`, {
        method: 'GET',
    });
}


export async function remove(id: string) {
    return request(`/jetlinks/email-sender/${id}`, {
        method: 'DELETE',
    });
}
