import request from '@/utils/request';
import getFakeChartData from './mock-data';
import { getAccessToken } from '@/utils/authority';

export async function fakeChartData() {
  return getFakeChartData;
  // return request('/api/fake_chart_data');
}

export async function getMulti(data: any) {
  return request(`/jetlinks/dashboard/_multi?:X_Access_Token=${getAccessToken()}`, {
    method: 'POST',
    data,
  });
}
