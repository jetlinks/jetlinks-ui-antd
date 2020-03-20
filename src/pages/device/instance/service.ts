import request from '@/utils/request';
import { DeviceInstance } from './data.d';
import { getAccessToken } from '@/utils/authority';

export async function list(params: any) {
  return request(`/jetlinks/device-instance/_query`, {
    method: 'GET',
    params,
  });
}

export async function count(params: any) {
  return request(`/jetlinks/device-instance/_count`, {
    method: 'GET',
    params,
  });
}

export async function info(id: string) {
  return request(`/jetlinks/device/instance/${id}/detail`, {
    method: 'GET',
  });
}

export async function saveOrUpdate(params: DeviceInstance) {
  return request(`/jetlinks/device-instance`, {
    method: 'PATCH',
    data: params,
  });
}

export async function remove(id: string) {
  return request(`/jetlinks/device-instance/${id}`, {
    method: 'DELETE',
  });
}

export async function logs(deviceId: string,params: any) {
  return request(`/jetlinks/device-instance/${deviceId}/logs`, {
    method: 'GET',
    params,
  });
}

export async function runInfo(id: string) {
  return request(`/jetlinks/device-instance/run-info/${id}`, {
    method: 'GET',
  });
}

export async function properties(productId: string, id: string) {
  return request(`/jetlinks/device-instance/${id}/properties/latest`, {
    method: 'GET',
  });
}

export async function fireAlarm(params: any) {
  return request(`/jetlinks/device-product/${params.protocol}/event/fire_alarm`, {
    method: 'GET',
    params: params.param,
  });
}

export async function changeDeploy(deviceId: string | undefined) {
  return request(`/jetlinks//device-instance/${deviceId}/deploy`, {
    method: 'POST',
  });
}

export async function unDeploy(deviceId: string) {
  return request(`/jetlinks//device-instance/${deviceId}/undeploy`, {
    method: 'POST',
  });
}

export async function property(id: string, type: string) {
  return request(`/jetlinks/device/standard/${id}/property/${type}`, {
    method: 'GET',
  });
}

export async function eventData(id: string, event: string, params: any) {
  return request(`/jetlinks/device/instance/${id}/event/${event}?format=true`, {
    method: 'GET',
    params,
  });
}

export async function functionsData(id: string, functions: string, data: any) {
  return request(`/jetlinks/device/invoked/${id}/function/${functions}`, {
    method: 'POST',
    data,
  });
}

export async function exportData(params: any) {
  return request(`/jetlinks/device-instance/export?:X_Access_Token=${getAccessToken()}`, {
    method: 'POST',
    params,
  });
}

export async function propertieInfo(deviceId: string, params: any) {
  return request(`/jetlinks/device-instance/${deviceId}/properties/_query`, {
    method: 'GET',
    params,
  });
}
export async function invokedFunction(deviceId: string,functionId: string, data: any) {
  return request(`/jetlinks/device/invoked/${deviceId}/function/${functionId}`, {
    method: 'POST',
    data,
  });
}

export async function disconnectDevice(deviceId: string | undefined) {
  return request(`/jetlinks//device/instance/${deviceId}/disconnect`, {
    method: 'POST',
  });
}

export async function update(deviceId: string | undefined, params: DeviceInstance) {
  return request(`/jetlinks/device/instance/${deviceId}`, {
    method: 'PUT',
    data: params,
  });
}

export async function saveDeviceTags(deviceId: string | undefined, params: any) {
  return request(`/jetlinks/device/instance/${deviceId}/tag`, {
    method: 'PATCH',
    data: params,
  });
}

export async function removeTags(deviceId: string | undefined, tagId: string) {
  return request(`/jetlinks//device/instance/${deviceId}/tag/${tagId}`, {
    method: 'DELETE',
  });
}

// export async function deployAll() {
//     return request(`/jetlinks/device-instance/deploy`, {
//         method: 'GET',
//         params: {
//             _: 1,
//             ':X_Access_Token': getAccessToken()
//         }
//     })
// }
