import request from '@/utils/request';
import { FlowCard } from './flow-card/data';

export async function list(params: any) {
  return request(`/jetlinks/network/card/_query`, {
    method: 'GET',
    params,
  });
}

export async function queryNoPagin(params: any) {
  return request(`/jetlinks/network/card/_query/no-paging`, {
    method: 'GET',
    params,
  });
}

// 查询总数
export async function count(params: any) {
  return request(`/jetlinks/network/card/_count`, {
    method: 'GET',
    params,
  });
}

// 根据ID查询
export async function info(id: string) {
  return request(`/jetlinks/network/card/${id}`, {
    method: 'GET',
  });
}

// 新增单个数据,并返回新增后的数据
export async function saveData(params: FlowCard) {
  return request(`/jetlinks/network/card`, {
    method: 'PATCH',
    data: params,
  });
}

// 保存
export async function saveOrUpdate(params: FlowCard) {
  return request(`/jetlinks/network/card`, {
    method: 'PATCH',
    data: params,
  });
}

// 根据ID修改数据
export async function update(id: string, params: object) {
  return request(`/jetlinks/network/card/${id}`, {
    method: 'PUT',
    data: params,
  });
}

// 删除
export async function remove(id: string) {
  return request(`/jetlinks/network/card/${id}`, {
    method: 'DELETE',
  });
}

// 同步物联卡状态
export async function sync() {
  return request(`/jetlinks/network/card/state/_sync`, {
    method: 'GET'
  });
}

// 绑定
export async function bindDevice(cardId: string, deviceId: string) {
  return request(`/jetlinks/network/card/${cardId}/${deviceId}/_bind`, {
    method: 'GET',
  });
}

// 解绑
export async function unbindDevice(cardId: string) {
  return request(`/jetlinks/network/card/${cardId}/_unbind`, {
    method: 'GET',
  });
}

// 条件查询同一产品下物联卡
export async function productCard(productId: string, params: any) {
  return request(`/jetlinks/network/card/${productId}/_query`, {
    method: 'GET',
    params,
  });
}

// 条件查询同一产品下对应状态物联卡数量
export async function productCardCount(productId: string, status: string) {
  return request(`/jetlinks/network/card/${productId}/${status}/state/_query`, {
    method: 'GET'
  });
}

// 复机已停机物联卡
export async function resumption(cardId: string) {
  return request(`/jetlinks/network/card/${cardId}/_resumption`, {
    method: 'GET',
  });
}

// 导入物联卡实例
export async function _import(configId: string, params: any) {
  return request(`/jetlinks/network/card/${configId}/_import`, {
    method: 'GET',
    params,
  });
}

// 下载物联卡导入模版
export async function template(format: string) {
  return request(`/jetlinks/network/card/template.${format}`, {
    method: 'GET',
  });
}

// 查询特定天数流量数据
export async function queryDateNum(cardId: string, dateNum: string) {
  return request(`/jetlinks/network/flow/${cardId}/_query/${dateNum}`, {
    method: 'GET',
  });
}

// 激活待激活物联卡
export async function changeDeploy(cardId: string) {
  return request(`/jetlinks/network/card/${cardId}/_activation`, {
    method: 'GET',
  });
}

// 停用已激活物联卡
export async function unDeploy(cardId: string) {
  return request(`/jetlinks/network/card/${cardId}/_deactivate`, {
    method: 'GET',
  });
}

// 流量统计
export async function statistics() {
  return request(`/jetlinks/network/card/flow/statistics`, {
    method: 'GET',
  });
}

// 激活数量
export async function using() {
  return request(`/jetlinks/network/card/using/state/_count`, {
    method: 'GET',
  });
}

// 未激活数量
export async function toBeActivated() {
  return request(`/jetlinks/network/card/toBeActivated/state/_count`, {
    method: 'GET',
  });
}

// 查询对应状态物联卡数量
export async function statusCount(status: string) {
  return request(`/jetlinks/network/card/${status}/state/_count`, {
    method: 'GET',
  });
}

// 查询物联卡状态操作日志
export async function stateOperateLog(params: any) {
  return request(`/jetlinks/network/card/stateOperate/_log`, {
    method: 'GET',
    params,
  });
}

// 查询物联卡充值缴费日志
export async function rechargeLog(params: any) {
  return request(`/jetlinks/network/card/recharge/_log`, {
    method: 'GET',
    params,
  });
}

// 充值缴费（暂不支持ctwingCmp）
export async function _recharge(params: any) {
  return request(`/jetlinks/network/card/_recharge`, {
    method: 'POST',
    data: params,
  });
}



// 流量管理
// 使用POST方式分页动态查询
export async function queryFlowList(params: any) {
  return request(`/jetlinks/network/flow/_query`, {
    method: 'POST',
    data: params,
  });
}

export async function queryFlowListNoPagin(params: any) {
  return request(`/jetlinks/network/flow/_query/no-paging`, {
    method: 'POST',
    data: params,
  });
}

// 保存
export async function saveFlow(params: any) {
  return request(`/jetlinks/network/flow`, {
    method: 'PATCH',
    data: params,
  });
}

// 根据ID查询
export async function queryFlowDetail(id: string, params: any) {
  return request(`/jetlinks/network/flow/${id}`, {
    method: 'GET',
    data: params,
  });
}

// 根据ID删除
export async function deleteFlow(id: string, params: any) {
  return request(`/jetlinks/network/flow/${id}`, {
    method: 'DELETE',
    data: params,
  });
}
