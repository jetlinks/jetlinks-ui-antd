import request from '@/utils/request';
import { RuleInstanceItem } from './data';

export async function list(params?: any) {
  return request(`/jetlinks/rule-engine/instance/_query`, {
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

export async function add(params: RuleInstanceItem) {
  return request(`/jetlinks/rule-engine/instance`, {
    method: 'POST',
    data: params,
  });
}

export async function _start(id: string) {
  return request(`/jetlinks/rule-engine/instance/${id}/_start`, {
    method: 'POST',
  });
}

export async function _stop(id: string) {
  return request(`/jetlinks/rule-engine/instance/${id}/_stop`, {
    method: 'POST',
  });
}

export async function remove(id:string) {
  return request(`/jetlinks/rule-engine/instance/${id}`, {
    method: 'DELETE',
  });
}
