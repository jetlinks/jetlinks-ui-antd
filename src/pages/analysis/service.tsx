import request from 'umi-request';
import getFakeChartData from './mock-data';

export async function fakeChartData() {
  return getFakeChartData;
  // return request('/api/fake_chart_data');
}
