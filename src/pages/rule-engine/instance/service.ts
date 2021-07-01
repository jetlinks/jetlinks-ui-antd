import request from '@/utils/request';
import { RuleInstanceItem } from './data.d';

type triggersType = {
  trigger: string
  cron: string
}

type configurationType = {
  notifyType: string
  productId: string
  message: {
    messageType: string
    properties: {
      cpuTemp: string
    }
  }
  deviceId: string
}

type actionsType = {
  executor: string
  configuration: configurationType
}

type stateType = {
  text: string
  value: string
}
export interface ListData {
  id: string
  name: string
  modelId: string
  description: string
  modelType: string
  modelMeta: string
  modelVersion: number
  createTime: number
  state: stateType
}

/**
 * 规则实例
 * @param id 
 * @param data 
 * @returns 
 */
export const ruleList = (id: string, data?: any) => request.post(`/jetlinks/edge/operations/${id}/rule-instance-list/invoke`, { data })

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

export async function info(id: string, ruleInstanceId: string) {
  return request(`/jetlinks/edge/operations/${id}/rule-instance-info/invoke`, {
    method: 'POST',
    data: {
      ruleInstanceId
    }
  });
}

export async function remove(id: string, ruleInstanceId: string) {
  return request(`/jetlinks/edge/operations/${id}/rule-instance-delete/invoke`, {
    method: 'POST',
    data: {
      ruleInstanceId
    }
  });
}

export async function start(id: string, data: { ruleInstanceId: string }) {
  return request(`/jetlinks/edge/operations/${id}/rule-instance-start/invoke`, {
    method: 'POST',
    data
  });
}

export async function stop(id: string, data: { ruleInstanceId: string }) {
  return request(`/jetlinks/edge/operations/${id}/rule-instance-stop/invoke`, {
    method: 'POST',
    data
  });
}

export async function startDeviceAlarm(deviceId: string, id: string) {
  return request(`/jetlinks/edge/operations/${deviceId}/rule-engine-alarm-delete/invoke`, {
    method: 'POST',
    data: { id }
  });
}

export async function stopDeviceAlarm(deviceId: string, id: string) {
  return request(`/jetlinks/edge/operations/${deviceId}/rule-engine-alarm-stop/invoke`, {
    method: 'POST',
    data: { id }
  });
}

export async function startScene(deviceId: string, id: string) {
  return request(`/jetlinks/edge/operations/${deviceId}/rule-engine-scene-start/invoke`, {
    method: 'POST',
    data: { id }
  });
}

export async function stopScene(deviceId: string, id: string) {
  return request(`/jetlinks/edge/operations/${deviceId}/rule-engine-scene-stop/invoke`, {
    method: 'POST',
    data: { id }
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

export async function create(params: any, deviceId: string) {
  return request(`/jetlinks/edge/operations/${deviceId}/rule-instance-save/invoke`, {
    method: 'POST',
    data: params
  });
}
