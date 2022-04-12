import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import type { ChannelItem } from './typings';
import Token from '@/utils/token';

class Service extends BaseService<ChannelItem> {
  //
  queryTree = (id: string, data?: any) =>
    request(`${this.uri}/device/${id}/catalog/_query/tree`, { method: 'POST', data });

  // 查询设备通道列表
  queryChannel = (id: string, data: any) =>
    request(`${this.uri}/device/${id}/channel/_query`, { method: 'POST', data });

  updateChannel = (id: string, data: any) =>
    request(`${this.uri}/channel/${id}`, { method: 'PUT', data });

  saveChannel = (data: any) => request(`${this.uri}/channel`, { method: 'POST', data });

  removeChannel = (id: string) => request(`${this.uri}/channel/${id}`, { method: 'DELETE' });

  // 设备详情
  deviceDetail = (id: string) => request(`${this.uri}/device/${id}`, { method: 'GET' });

  // 开始直播
  ptzStart = (deviceId: string, channelId: string, type: string) =>
    `${this.uri}/device/${deviceId}/${channelId}/live.${type}?:X_Access_Token=${Token.get()}`;

  // 云台控制-停止
  ptzStop = (deviceId: string, channelId: string) =>
    request(`${this.uri}/device/${deviceId}/${channelId}/_stop`, { method: 'POST' });

  // 云台控制-缩放、转向等
  ptzTool = (deviceId: string, channelId: string, direct: string, speed: number = 90) =>
    request(`${this.uri}/device/${deviceId}/${channelId}/_ptz/${direct}/${speed}`, {
      method: 'POST',
    });

  // 重置
  mediaStop = (deviceId: string, channelId: string) =>
    request(`${this.uri}/device/${deviceId}/${channelId}/_stop`, { method: 'POST' });

  // 查询是否正在录像
  ptzIsRecord = (deviceId: string, channelId: string) =>
    request(`${this.uri}/device/${deviceId}/${channelId}/live/recording`, { method: 'GET' });

  // 开始录像
  recordStart = (deviceId: string, channelId: string, data: any) =>
    request(`${this.uri}/device/${deviceId}/${channelId}/_record`, { method: 'POST', data });

  // 停止录像
  recordStop = (deviceId: string, channelId: string, data: any) =>
    request(`${this.uri}/device/${deviceId}/${channelId}/_stop-record`, { method: 'POST', data });

  // 查询本地回放记录
  queryRecordLocal = (deviceId: string, channelId: string, data: any) =>
    request(`${this.uri}/device/${deviceId}/${channelId}/records/in-local`, {
      method: 'POST',
      data,
    });

  // 播放本地回放
  playbackLocal = (deviceId: string, channelId: string, suffix: string) =>
    request(`${this.uri}/device/${deviceId}/${channelId}/playback.${suffix}`, { method: 'GET' });

  // 本地录像播放控制
  playbackControl = (deviceId: string, channelId: string) =>
    request(`${this.uri}/device/${deviceId}/${channelId}/stream-control`, { method: 'POST' });

  // 查询云端回放记录
  recordsInServer = (deviceId: string, channelId: string) =>
    request(`${this.uri}/device/${deviceId}/${channelId}/records/in-server`, { method: 'POST' });

  // 查询云端回放文件信息
  recordsInServerFiles = (deviceId: string, channelId: string) =>
    request(`${this.uri}/device/${deviceId}/${channelId}/records/in-server/files`, {
      method: 'POST',
    });

  // 播放云端回放
  playbackStart = (recordId: string) =>
    request(`${this.uri}/record/${recordId}.mp4`, { method: 'GET' });
}

export default Service;
