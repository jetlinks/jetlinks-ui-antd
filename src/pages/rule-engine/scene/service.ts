import request from '@/utils/request';
// import { RuleInstanceItem } from './data.d';

export async function list(params?: any) {
  return request(`/jetlinks/rule-engine/scene/_query`, {
    method: 'GET',
    params,
  });
}

export async function listNoPaging(params?: any) {
  return request(`/jetlinks/rule-engine/scene/_query/no-paging`, {
    method: 'GET',
    params,
  });
}

export async function save(params?: any) {
  return request(`/jetlinks/rule-engine/scene`, {
    method: 'PATCH',
    data: params,
  });
}

export async function info(id: string) {
  return request(`/jetlinks/rule-engine/scene/${id}`, {
    method: 'GET',
  });
}

export async function remove(id: string) {
  return request(`/jetlinks/rule-engine/scene/${id}`, {
    method: 'DELETE',
  });
}

export async function start(id: string) {
  return request(`/jetlinks/rule-engine/scene/${id}/_start`, {
    method: 'POST',
  });
}

export async function stop(id: string) {
  return request(`/jetlinks/rule-engine/scene/${id}/_stop`, {
    method: 'POST',
  });
}

export async function perform(id: string) {
  return request(`/jetlinks/rule-engine/scene/${id}/execute`, {
    method: 'POST',
  });
}