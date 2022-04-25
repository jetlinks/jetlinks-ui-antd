import { request } from '@@/plugin-request/request';
import SystemConst from '@/utils/const';

export const queryMessageType = () =>
  request(`${SystemConst.API_BASE}/notifier/config/types`, { method: 'GET' });

// 通知配置
export const queryMessageConfig = (data: any) =>
  request(`${SystemConst.API_BASE}/notifier/config/_query/no-paging?paging=false`, {
    method: 'POST',
    data,
  });

// 通知模板
export const queryMessageTemplate = (data: any) =>
  request(`${SystemConst.API_BASE}/notifier/template/_query/no-paging?paging=false`, {
    method: 'POST',
    data,
  });

export const queryProductList = (data?: any) =>
  request(`${SystemConst.API_BASE}/device-product/_query/no-paging?paging=false`, {
    method: 'POST',
    data,
  });

export const queryDeviceSelector = () =>
  request(`${SystemConst.API_BASE}/scene/device-selectors`, { method: 'GET' });
