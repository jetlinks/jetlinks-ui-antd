import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import type { DeviceInstance, PropertyData } from '@/pages/device/Instance/typings';
import SystemConst from '@/utils/const';
import { defer, from, mergeMap, toArray } from 'rxjs';
import { filter, groupBy, map } from 'rxjs/operators';

class Service extends BaseService<DeviceInstance> {
  public detail = (id: string) => request(`${this.uri}/${id}/detail`, { method: 'GET' });

  // 查询产品列表
  public getProductList = (params: any) =>
    request(`/${SystemConst.API_BASE}/device/product/_query/no-paging`, { method: 'GET', params });

  // 批量删除设备
  public batchDeleteDevice = (params: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/batch/_delete`, {
      method: 'PUT',
      data: params,
    });

  // 启用设备
  public deployDevice = (deviceId: string, params?: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/deploy`, {
      method: 'POST',
      data: params,
    });

  // 禁用设备
  public undeployDevice = (deviceId: string, params?: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/undeploy`, {
      method: 'POST',
      data: params,
    });

  // 批量激活设备
  public batchDeployDevice = (params: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/batch/_deploy`, {
      method: 'PUT',
      data: params,
    });

  // 批量注销设备
  public batchUndeployDevice = (params: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/batch/_undeploy`, {
      method: 'PUT',
      data: params,
    });

  // 激活所有设备
  public deployAllDevice = (params?: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/deploy`, { method: 'GET', params });

  // 同步设备
  public syncDevice = () =>
    request(`/${SystemConst.API_BASE}/device-instance/state/_sync`, { method: 'GET' });

  //验证设备ID是否重复
  public isExists = (id: string) =>
    request(`/${SystemConst.API_BASE}/device-instance/${id}/exists`, { method: 'GET' });

  public getConfigMetadata = (id: string) =>
    request(`${this.uri}/${id}/config-metadata`, { method: 'GET' });

  public getUnits = () => request(`/${SystemConst.API_BASE}/protocol/units`, { method: 'GET' });

  public propertyRealTime = (data: Record<string, unknown>[]) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/dashboard/_multi`, {
          method: 'POST',
          data,
        }),
      ).pipe(
        filter((resp) => resp.status === 200),
        map((resp) => resp.result),
        mergeMap((temp: PropertyData[]) => from(temp)),
        map((item) => ({
          timeString: item.data.timeString,
          timestamp: item.data.timestamp,
          ...item.data.value,
        })),
        groupBy((group$) => group$.property),
        mergeMap((group) => group.pipe(toArray())),
        map((arr) => ({
          list: arr.sort((a, b) => a.timestamp - b.timestamp),
          property: arr[0].property,
        })),
        // toArray()
      ),
    );

  public getProperty = (id: string, type: string) =>
    request(`/${SystemConst.API_BASE}/device/standard/${id}/property/${type}`, {
      method: 'GET',
    });

  public setProperty = (deviceId: string, data: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device/instance/${deviceId}/property`, {
      method: 'PUT',
      data,
    });

  public getPropertyData = (deviceId: string, params: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/properties/_query`, {
      method: 'GET',
      params,
    });

  public getEventCount = (deviceId: string, eventId: string, params: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device/instance/${deviceId}/event/${eventId}`, {
      method: 'POST',
      data: params,
    });

  public deleteMetadata = (deviceId: string) =>
    request(`/${SystemConst.API_BASE}/device/instance/${deviceId}/metadata`, {
      method: 'DELETE',
    });

  public invokeFunction = (deviceId: string, functionId: string, data: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device/invoked/${deviceId}/function/${functionId}`, {
      method: 'POST',
      data,
    });

  public queryLog = (deviceId: string, params: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/logs`, {
      method: 'POST',
      data: params,
    });

  public getLogType = () =>
    request(`/${SystemConst.API_BASE}/dictionary/device-log-type/items`, {
      method: 'GET',
    });
  public bindDevice = (deviceId: string, data: string[]) =>
    request(`/${SystemConst.API_BASE}/device/gateway/${deviceId}/bind`, {
      method: 'POST',
      data,
    });
  public unbindDevice = (deviceId: string, childrenId: string, data: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device/gateway/${deviceId}/unbind/${childrenId}`, {
      method: 'POST',
      data,
    });
  public unbindBatchDevice = (deviceId: string, data: string[]) =>
    request(`/${SystemConst.API_BASE}/device/gateway/${deviceId}/unbind`, {
      method: 'POST',
      data,
    });
  public configurationReset = (deviceId: string) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/configuration/_reset`, {
      method: 'PUT',
    });

  public saveTags = (deviceId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/tag`, {
      method: 'PATCH',
      data,
    });
}

export default Service;
