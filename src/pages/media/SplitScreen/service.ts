import { request } from '@@/plugin-request/request';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';

const url = `/${SystemConst.API_BASE}/media`;

// 设备树
export const getMediaTree = (data?: any) =>
  request(`${url}/device/_query/no-paging`, { method: 'POST', data });

// 开始直播
export const ptzStart = (deviceId: string, channelId: string, type: string) =>
  `${url}/device/${deviceId}/${channelId}/live.${type}?:X_Access_Token=${Token.get()}`;

// 云台控制-停止
export const ptzStop = (deviceId: string, channelId: string) =>
  request(`${url}/device/${deviceId}/${channelId}/_ptz/STOP`, { method: 'POST' });

// 云台控制-缩放、转向等
export const ptzTool = (deviceId: string, channelId: string, direct: string, speed: number = 90) =>
  request(`${url}/device/${deviceId}/${channelId}/_ptz/${direct}/${speed}`, { method: 'POST' });

// 查询设备通道列表
export const queryChannel = (data: any) =>
  request(`${url}/channel/_query`, { method: 'POST', data });
