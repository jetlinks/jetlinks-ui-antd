import request from '@/utils/request';

export async function _search(data?: any) {
  return request(`/jetlinks/geo/object/_search`, {
    method: 'POST',
    data,
  });
}
export async function _search_geo_json(data?: any) {
  return request(`/jetlinks/geo/object/_search/geo.json`, {
    method: 'POST',
    data,
  });
}
