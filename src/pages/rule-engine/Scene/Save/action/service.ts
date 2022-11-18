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

export const queryMessageConfigPaging = (data: any) =>
  request(`${SystemConst.API_BASE}/notifier/config/_query`, {
    method: 'POST',
    data,
  });

// 通知模板
export const queryMessageTemplate = (data: any) =>
  request(`${SystemConst.API_BASE}/notifier/template/_query/no-paging?paging=false`, {
    method: 'POST',
    data,
  });

export const queryMessageTemplatePaging = (id: string, data: any) =>
  request(`${SystemConst.API_BASE}/notifier/template/${id}/_query`, {
    method: 'POST',
    data,
  });

export const queryMessageTemplateDetail = (id: string) =>
  request(`${SystemConst.API_BASE}/notifier/template/${id}/detail`);

export const queryProductList = (data?: any) =>
  request(`${SystemConst.API_BASE}/device-product/_query/no-paging?paging=false`, {
    method: 'POST',
    data,
  });

export const queryDeviceSelector = () =>
  request(`${SystemConst.API_BASE}/scene/device-selectors`, { method: 'GET' });

// 内置参数
export const queryBuiltInParams = (data: any, params?: any) =>
  request(`${SystemConst.API_BASE}/scene/parse-variables`, { method: 'POST', data, params });

// 平台用户
export const queryPlatformUsers = () =>
  request(`${SystemConst.API_BASE}/user/_query/no-paging`, {
    method: 'POST',
    data: { paging: false, sorts: [{ name: 'name', order: 'asc' }] },
  });

// 关系用户
export const queryRelationUsers = () =>
  request(`${SystemConst.API_BASE}/relation/_query/no-paging`, {
    method: 'POST',
    data: { paging: false, sorts: [{ name: 'name', order: 'asc' }] },
  });

// 钉钉用户
export const queryDingTalkUsers = (id: string) =>
  request(
    `${SystemConst.API_BASE}/notifier/dingtalk/corp/${id}/users?sorts[0].name='name'&sorts[0].order=asc`,
    { method: 'GET' },
  );

// 钉钉部门
export const queryDingTalkDepartments = (id: string) =>
  request(`${SystemConst.API_BASE}/notifier/dingtalk/corp/${id}/departments/tree`, {
    method: 'GET',
  });

// 微信用户
export const queryWechatUsers = (id: string) =>
  request(
    `${SystemConst.API_BASE}/notifier/wechat/corp/${id}/users?sorts[0].name='name'&sorts[0].order=asc`,
    { method: 'GET' },
  );

// 微信部门
export const queryWechatDepartments = (id: string) =>
  request(`${SystemConst.API_BASE}/notifier/wechat/corp/${id}/departments`, { method: 'GET' });

// 根据配置ID获取标签推送
export const queryTag = (id: string) =>
  request(`${SystemConst.API_BASE}/notifier/wechat/corp/${id}/tags`, { method: 'GET' });

export const getRelations = () =>
  request(`${SystemConst.API_BASE}/relation/_query/no-paging`, {
    method: 'POST',
    data: {
      paging: false,
      sorts: [{ name: 'createTime', order: 'desc' }],
      terms: [{ termType: 'eq', column: 'objectTypeName', value: '设备' }],
    },
  });
