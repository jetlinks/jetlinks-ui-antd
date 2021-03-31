import request from '@/utils/request';
import { RuleInstanceItem } from './data.d';

export async function list(params?: any) {
  return request(`/jetlinks/rule-engine/instance/_query`, {
    method: 'GET',
    params,
  });
}

export async function listNoPaging(params?: any) {
  return request(`/jetlinks/rule-engine/instance/_query/no-paging`, {
    method: 'GET',
    params,
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
  });
}

export async function stop(id: string) {
  return request(`/jetlinks/rule-engine/instance/${id}/_stop`, {
    method: 'POST',
  });
}

export async function startDeviceAlarm(id: string) {
  return request(`/jetlinks/device/alarm/${id}/_start`, {
    method: 'POST',
  });
}

export async function stopDeviceAlarm(id: string) {
  return request(`/jetlinks/device/alarm/${id}/_stop`, {
    method: 'POST',
  });
}

export async function startScene(id: string) {
  return request(`/jetlinks/rule-engine/scene/${id}/_start`, {
    method: 'POST',
  });
}

export async function stopScene(id: string) {
  return request(`/jetlinks/rule-engine/scene/${id}/_stop`, {
    method: 'POST',
  });
}

export async function createModel(params: RuleInstanceItem) {
  return request(`/jetlinks/rule-engine/model`, {
    method: 'POST',
    data: params,
  });
}

export async function log(id: string, params: any) {
  return request(`/jetlinks/rule-engine/instance/${id}/logs`, {
    method: 'GET',
    params,
  });
}

export async function event(id: string, params: any) {
  return request(`/jetlinks/rule-engine/instance/${id}/events`, {
    method: 'GET',
    params,
  });
}

export async function node(id: string, params: any) {
  return request(`/jetlinks/rule-engine/instance/${id}/nodes`, {
    method: 'GET',
    params,
  });
}

export async function create(params: any) {
  return request(`/jetlinks/rule-editor/flows/_create`, {
    method: 'POST',
    data: params
  });
}
