import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';
import type { DeviceItem } from './typings';

class Service extends BaseService<DeviceItem> {
  saveData = (channelId: string, data?: any) =>
    request(`${this.uri}/${channelId}`, { method: 'POST', data });

  updateData = (channel: string, deviceId: string, data?: any) =>
    request(`${this.uri}/${channel}/${deviceId}`, { method: 'PUT', data });

  // 新增GB28181接入的设备
  saveGB = (data?: any) => request(`${this.uri}/gb28181`, { method: 'PATCH', data });

  // 新增固定地址接入的设备
  saveFixed = (data?: any) => request(`${this.uri}/fixed-url`, { method: 'PATCH', data });

  // 更新通道
  updateChannels = (id: string) => request(`${this.uri}/${id}/channels/_sync`, { method: 'POST' });

  // 快速添加产品
  saveProduct = (data?: any) =>
    request(`/${SystemConst.API_BASE}/device/product`, { method: 'POST', data });

  // 产品发布
  deployProductById = (id: string) =>
    request(`/${SystemConst.API_BASE}/device/product/${id}/deploy`, { method: 'POST' });

  // 查询产品列表
  queryProductList = (data?: any) =>
    request(`/${SystemConst.API_BASE}/device/product/_query/no-paging`, { method: 'POST', data });

  // 查询设备接入配置
  queryProvider = (data?: any) =>
    request(`/${SystemConst.API_BASE}/gateway/device/detail/_query`, { method: 'POST', data });
  //视频设备详情
  getDetail = (id: string) => request(`${this.uri}/${id}`, { method: 'GET' });
  // 查询产品列表
  getProductList = (params?: any) =>
    request(`/${SystemConst.API_BASE}/device/product/_query/no-paging?paging=false`, {
      method: 'GET',
      params,
    });

  getConfiguration = (id: string, transport: string) =>
    request(`/${SystemConst.API_BASE}/protocol/${id}/${transport}/configuration`, {
      method: 'GET',
    });
}

export default Service;
