import { request } from '@@/plugin-request/request';
import SystemConst from '@/utils/const';

const url = `/${SystemConst.API_BASE}/media`;

// 设备树
export const getMediaTree = (data?: any) =>
  request(`${url}/device/_query/no-paging`, { method: 'POST', data });

// 开始直播
export const ptzStart = (deviceId: string, channelId: string) =>
  request(`${url}/device/${deviceId}/${channelId}/_pzt/_start`, { method: 'POST' });

// 云台控制-停止
export const ptzStop = (deviceId: string, channelId: string) =>
  request(`${url}/device/${deviceId}/${channelId}/_pzt/STOP`, { method: 'POST' });

// 云台控制-缩放、转向等
export const ptzTool = (deviceId: string, channelId: string, direct: string, speed: number = 90) =>
  request(`${url}/device/${deviceId}/${channelId}/_pzt/${direct}/${speed}`, { method: 'POST' });

// 查询设备通道列表
export const queryChannel = (data: any) =>
  request(`${url}/channel/_query`, { method: 'POST', data });
