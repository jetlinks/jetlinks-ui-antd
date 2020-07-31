import request from '@/utils/request';

export async function getProductAlarms(target: string, targetId: string | undefined) {
  return request(`/jetlinks/device/alarm/${target}/${targetId}`, {
    method: 'GET',
  });
}

export async function saveProductAlarms(target: string, targetId: string | undefined, data: any) {
  return request(`/jetlinks/device/alarm/${target}/${targetId}`, {
    method: 'PATCH',
    data,
  });
}

export async function _start(id: string) {
  return request(`/jetlinks/device/alarm/${id}/_start`, {
    method: 'POST',
  });
}

export async function _stop(id: string) {
  return request(`/jetlinks/device/alarm/${id}/_stop`, {
    method: 'POST',
  });
}

export async function remove(id: string) {
  return request(`/jetlinks/device/alarm/${id}`, {
    method: 'DELETE',
  });
}

export async function findAlarmLog(params: any) {
  return request(`/jetlinks/device/alarm/history/_query`, {
    method: 'GET',
    params,
  });
}

export async function findAlarmLogCount(params: any) {
  return request(`/jetlinks/device/alarm/history/_count`, {
    method: 'GET',
    params,
  });
}

export async function alarmLogSolve(id: string, data: any) {
  return request(`/jetlinks/device/alarm/history/${id}/_solve`, {
    method: 'PUT',
    data,
  });
}
