import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import type { DeviceInstance, PropertyData } from '@/pages/device/Instance/typings';
import SystemConst from '@/utils/const';
import { defer, from, mergeMap, toArray } from 'rxjs';
import { filter, groupBy, map } from 'rxjs/operators';

class Service extends BaseService<DeviceInstance> {
  public detail = (id: string) => request(`${this.uri}/${id}/detail`, { method: 'GET' });

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
      method: 'GET',
      params,
    });
}

export default Service;
