import request from '@/utils/request';
import { RuleInstanceItem } from './data';

export async function list(params?: any) {
    return request(`/jetlinks/rule-engine/instance/_query`, {
        method: 'GET',
        params: params,
    });
}

export async function listNoPaging(params?: any) {
    return request(`/jetlinks/rule-engine/instance/_query/no-paging`, {
        method: 'GET',
        params: params,
    });
}

export async function saveOrUpdate(params: RuleInstanceItem) {
    return request(`/jetlinks/rule-engine/instance/`, {
        method: 'PATCH',
        data: params,
    });
}

export async function info(id: string) {
    return request(`/jetlinks/rule-engine/instance/${id}`, {
        method: 'GET',
    });
}


export async function remove(id: string) {
    return request(`/jetlinks/rule-engine/instance/${id}`, {
        method: 'DELETE',
    });
}

export async function start(id: string) {
    return request(`/jetlinks/rule-engine/instance/${id}/_start`, {
        method: 'POST',
    })
}

export async function createModel(params: RuleInstanceItem) {
    return request(`/jetlinks/rule-engine/model`, {
        method: 'POST',
        data: params
    })
}