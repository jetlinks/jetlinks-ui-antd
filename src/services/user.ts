import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  return request('/jetlinks/authorize/me', {
    method: 'GET',
  });
}

export async function systemVersion(): Promise<any> {
  return request(`/jetlinks/system/version`);
}

export async function queryNotices(params: any): Promise<any> {
  return request(`/jetlinks/notifications/_query`, {
    method: "GET",
    params,
  });
}