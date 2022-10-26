import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import type { CardManagement } from '@/pages/iot-card/CardManagement/typing';
import SystemConst from '@/utils/const';

const basePath = `/${SystemConst.API_BASE}`;

class Service extends BaseService<CardManagement> {
  queryById = (id: string) => request(`${this.uri}/${id}`, { method: 'GET' });

  queryDeviceList = (data: any) =>
    request(`${basePath}/device-instance/_query/`, { method: 'POST', data });

  queryDeviceListNoPage = (data: any) =>
    request(`${basePath}/device-instance/_query/no-paging?paging=false`, { method: 'POST', data });

  bind = (cardId: string, deviceId: string) =>
    request(`${this.uri}/${cardId}/${deviceId}/_bind`, {});

  unbind = (cardId: string) => this.GET(`${this.uri}/${cardId}/_unbind`);

  recharge = (data: any) => this.POST(`${this.uri}/_recharge`, data);

  unDeploy = (cardId: string) => this.GET(`${this.uri}/${cardId}/_deactivate`);

  resumption = (cardId: string) => this.GET(`${this.uri}/${cardId}/_resumption`);

  sync = () => this.GET(`${this.uri}/state/_sync`);

  listOnelinkNoPaging = (data: any) => this.POST(`${basePath}/onelink/_query/no-paging`, data);

  listCtwingCmpNoPaging = (data: any) => this.POST(`${basePath}/ctwingCmp/_query/no-paging`, data);

  // 导入物联卡实例
  _import = (configId: string, params: any) => this.GET(`${this.uri}/${configId}/_import`, params);

  // 根据id批量导出
  _export = (format: string, params: any) =>
    this.POST(`${this.uri}/download.${format}/_query`, {}, params, { responseType: 'blob' });

  // 批量删除物联卡
  removeCards = (data: any) => this.POST(`${this.uri}/batch/_delete`, data);

  // 通知提醒保存
  saveNotice = (data: any) => this.POST(`${this.uri}/notice`, data);

  // 查询物联卡充值缴费日志
  queryRechargeList = (data: any) => this.POST(`${this.uri}/recharge/_log`, data);

  // 查询物联卡状态操作日志
  queryRecordList = (data: any) => this.POST(`${this.uri}/stateOperate/_log`, data);

  queryPlatformNoPage = (data: any) => this.POST(`${this.uri}/platform/_query/no-paging`, data);

  queryUnbounded = (data: any) => this.POST(`${this.uri}/unbounded/device/_query`, data);

  queryCardNoPage = () => this.GET(`${this.uri}/_query/no-paging?paging=false`);
}

export default Service;
