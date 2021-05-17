import request from '@/utils/request';
// import { AutzSetting } from '@/components/SettingAutz/AutzSetting';
import { PermissionItem } from './data';

export async function list(params?: any) {
  return request(`/jetlinks/permission/_query`, {
    method: 'GET',
    params,
  });
}

export async function listNoPaging(params?: any) {
  // return request(`/jetlinks/permission/_query/no-paging?paging=false`, {
  return request(`/jetlinks/permission/_query/for-grant`, {
    method: 'GET',
    params,
  });
}

export async function detail(id: string) {
  return request(`/jetlinks/permission/${id}`, {
    method: 'GET',
  });
}

export async function remove(id: string) {
  return request(`/jetlinks/permission/${id}`, {
    method: 'DELETE',
  });
}

export async function save(params: PermissionItem) {
  return request(`/jetlinks/permission`, {
    method: 'PATCH',
    data: params,
  });
}

export async function importData(params: PermissionItem) {
  return request(`/jetlinks/permission`, {
    method: 'PATCH',
    data: params,
  });
}

export async function add(params: PermissionItem) {
  return request(`/jetlinks/permission`, {
    method: 'POST',
    data: params,
  });
}

export async function update(params: PermissionItem) {
  return request(`/jetlinks/permission/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}

export async function autzSetting(params: { settingId: string; settingType: string }) {
  return request(`/jetlinks/autz-setting/${params.settingType}/${params.settingId}`, {
    method: 'GET',
  });
}

export async function setAutz(params: any) {
  return request(`/jetlinks/autz-setting`, {
    method: 'PATCH',
    data: params,
  });
}
