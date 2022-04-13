import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import Token from '@/utils/token';
import { recordsItemType } from '@/pages/media/Device/Playback/typings';

class Service extends BaseService<recordsItemType> {
  // 开始直播
  ptzStart = (deviceId: string, channelId: string, type: string) =>
    `${this.uri}/device/${deviceId}/${channelId}/live.${type}?:X_Access_Token=${Token.get()}`;

  // 查询本地回放记录
  queryRecordLocal = (deviceId: string, channelId: string, data?: any) =>
    request(`${this.uri}/device/${deviceId}/${channelId}/records/in-local`, {
      method: 'POST',
      data,
    });

  // 播放本地回放
  playbackLocal = (
    deviceId: string,
    channelId: string,
    suffix: string,
    startTime: number,
    endTime: number,
    speed: number = 1,
  ) =>
    `${
      this.uri
    }/device/${deviceId}/${channelId}/playback.${suffix}?:X_Access_Token=${Token.get()}&startTime=${startTime}&endTime=${endTime}&speed=${speed}`;

  // 本地录像播放控制
  playbackControl = (deviceId: string, channelId: string) =>
    request(`${this.uri}/device/${deviceId}/${channelId}/stream-control`, { method: 'POST' });

  // 查询云端回放记录
  recordsInServer = (deviceId: string, channelId: string, data: any) =>
    request(`${this.uri}/device/${deviceId}/${channelId}/records/in-server`, {
      method: 'POST',
      data,
    });

  // 查询云端回放文件信息
  recordsInServerFiles = (deviceId: string, channelId: string, data: any) =>
    request(`${this.uri}/device/${deviceId}/${channelId}/records/in-server/files`, {
      method: 'POST',
      data,
    });

  // 播放云端回放
  playbackStart = (recordId: string) =>
    request(`${this.uri}/record/${recordId}.mp4`, { method: 'GET' });
}

export default Service;
