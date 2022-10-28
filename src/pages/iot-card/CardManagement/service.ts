import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import type { CardManagement } from '@/pages/iot-card/CardManagement/typing';
import SystemConst from '@/utils/const';

const basePath = `/${SystemConst.API_BASE}`;

class Service extends BaseService<CardManagement> {
  add = (data: any) => this.PATCH(`${this.uri}`, data);

  queryById = (id: string) => request(`${this.uri}/${id}`, { method: 'GET' });

  queryDeviceList = (data: any) =>
    request(`${basePath}/device-instance/_query/`, { method: 'POST', data });

  queryDeviceListNoPage = (data: any) =>
    request(`${basePath}/device-instance/_query/no-paging?paging=false`, { method: 'POST', data });

  bind = (cardId: string, deviceId: string) =>
    request(`${this.uri}/${cardId}/${deviceId}/_bind`, {});

  unbind = (cardId: string) => this.GET(`${this.uri}/${cardId}/_unbind`);

  recharge = (data: any) => this.POST(`${this.uri}/_recharge`, data);
  // 激活待激活物联卡
  changeDeploy = (cardId: string) => this.GET(`/${this.uri}/${cardId}/_activation`);
  // 停用已激活物联卡
  unDeploy = (cardId: string) => this.GET(`${this.uri}/${cardId}/_deactivate`);
  // 复机已停机物联卡
  resumption = (cardId: string) => this.GET(`${this.uri}/${cardId}/_resumption`);

  // 激活待激活物联卡
  changeDeployBatch = (data: any) => this.GET(`/${this.uri}/_activation/_bitch`, data);
  // 停用已激活物联卡
  unDeployBatch = (data: any) => this.GET(`${this.uri}/_deactivate/_bitch`, data);
  // 复机已停机物联卡
  resumptionBatch = (data: any) => this.GET(`${this.uri}/_resumption/_bitch`, data);

  sync = () => this.GET(`${this.uri}/state/_sync`);

  listOnelinkNoPaging = (data: any) => this.POST(`${basePath}/onelink/_query/no-paging`, data);

  listCtwingCmpNoPaging = (data: any) => this.POST(`${basePath}/ctwingCmp/_query/no-paging`, data);

  // 导入物联卡实例
  _import = (configId: string, params: any) => this.GET(`${this.uri}/${configId}/_import`, params);

  // 根据id批量导出
  _export = (format: string, params: any) =>
    this.POST(`${this.uri}/download.${format}/_query`, params, {}, { responseType: 'blob' });

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

  // 查询特定天数流量数据
  queryFlow = (beginTime: number, endTime: number, data: any) =>
    this.POST(`${basePath}/network/flow/_query/${beginTime}/${endTime}`, data);
  // 查询对应状态物联卡数量
  queryState = (status: string) => this.GET(`${this.uri}/${status}/state/_count`);
}

export default Service;
