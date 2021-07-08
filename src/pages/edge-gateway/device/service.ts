import request from "@/utils/request";

export async function list(params: any) {
  return request(`/jetlinks/device/instance/_query`, {
    method: 'GET',
    params,
  });
}
export async function save(params: any) {
  return request(`/jetlinks/device-instance`, {
    method: 'POST',
    data: params,
  });
}

export async function update(params: any) {
  return request(`/jetlinks/device-instance`, {
    method: 'PATCH',
    data: params,
  });
}

export async function info(id: string) {
  return request(`/jetlinks/device/instance/${id}/detail`, {
    method: 'GET',
  });
}
// export async function info(deviceId: string) {
//   return request(`/jetlinks/edge/operations/${deviceId}/detail`, {
//     method: 'GET',
//   });
// }

export async function remove(id: string) {
  return request(`/jetlinks/device-instance/${id}`, {
    method: 'DELETE',
  });
}

export async function getOnvif(id: string, params: any) {
  return request(`/jetlinks/edge/operations/${id}/onvif-information/invoke`, {
    method: 'POST',
    data: params
  });
}

export async function getOnvifList(id: string) {
  return request(`/jetlinks/edge/operations/${id}/onvif-discover/invoke`, {
    method: 'POST'
  });
}

export async function addOnvif(id: string, params: any) {
  return request(`/jetlinks/edge/operations/${id}/onvif-add/invoke`, {
    method: 'POST',
    data: params
  });
}

export async function getOnvifStream(id: string) {
  return request(`/jetlinks/edge/operations/${id}/onvif-stream/invoke`, {
    method: 'POST'
  });
}

export async function getDeviceList(id: string, params: any) {
  return request(`/jetlinks/edge/operations/${id}/media-device-list/invoke`, {
    method: 'POST',
    data: params
  });
}

export async function getChannelList(id: string, params: any) {
  return request(`/jetlinks/edge/operations/${id}/media-channel-list/invoke`, {
    method: 'POST',
    data: params
  });
}

export async function saveChannel(deviceId: string, params: any) {
  return request(`/jetlinks/edge/operations/${deviceId}/media-channel-save/invoke`, {
    method: 'POST',
    data: params
  });
}

export async function delDevice(deviceId: string, params: any) {
  return request(`/jetlinks/edge/operations/${deviceId}/media-device-delete/invoke`, {
    method: 'POST',
    data: params
  });
}

export async function delChannel(deviceId: string, params: any) {
  return request(`/jetlinks/edge/operations/${deviceId}/media-channel-delete/invoke`, {
    method: 'POST',
    data: params
  });
}

export async function getDeviceInfo(deviceId: string, params: any) {
  return request(`/jetlinks/edge/operations/${deviceId}/media-device-info/invoke`, {
    method: 'POST',
    data: params
  });
}

export async function getChannelInfo(deviceId: string, params: any) {
  return request(`/jetlinks/edge/operations/${deviceId}/media-channel-info/invoke`, {
    method: 'POST',
    data: params
  });
}

export async function reload(deviceId: string) {
  return request(`/jetlinks/edge/operations/${deviceId}/restart/invoke`, {
    method: 'POST'
  });
}

export async function getProperty(deviceId: string, id: string) {
  return request(`/jetlinks/edge/operations/${deviceId}/property/${id}`, {
    method: 'GET'
  });
}