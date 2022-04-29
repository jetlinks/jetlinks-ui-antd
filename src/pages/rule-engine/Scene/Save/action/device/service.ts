import { request } from '@@/plugin-request/request';
import SystemConst from '@/utils/const';

// 获取设备
export const queryDevice = (data: any) =>
  request(`${SystemConst.API_BASE}/device-instance/_query`, {
    method: 'POST',
    data: data,
  });

// 获取设备
export const queryAllDevice = (data: any) =>
  request(`${SystemConst.API_BASE}/device-instance/_query/no-paging`, {
    method: 'POST',
    data: data,
  });

// 获取产品
export const getProductList = (params?: any) =>
  request(`/${SystemConst.API_BASE}/device/product/_query/no-paging`, { method: 'GET', params });
