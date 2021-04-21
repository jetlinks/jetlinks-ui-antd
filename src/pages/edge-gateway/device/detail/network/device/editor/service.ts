import BaseService from '@/services/crud';
import { defer, from } from 'rxjs';
import request from '@/utils/request';
import { map, filter, flatMap } from 'rxjs/operators';
import encodeQueryParam from '@/utils/encodeParam';

class Service extends BaseService<any> {
  public propertiesRealTime = (data: any) =>
    defer(() =>
      from(
        request(`/jetlinks/dashboard/_multi`, {
          method: 'POST',
          data,
        }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
        flatMap((data: Data[]) => from(data)),
        map(item => ({
          timeString: item.data.timeString,
          timestamp: item.data.timestamp,
          ...item.data.value,
        })),
      ),
    );

  public getProperty = (id: string, type: string) =>
    defer(() =>
      from(
        request(`/jetlinks/device/standard/${id}/property/${type}`, {
          method: 'GET',
        }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result),
      ),
    );

  public getPropertyDevice = (deviceId: string, params: any) =>
    defer(() =>
      from(
        request(`/jetlinks/edge/operations/${deviceId}/device-property-read/invoke`, {
          method: 'POST',
          data: params
        }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result[0]),
      ),
    );
  public invokedFunction = (deviceId: string, params: any) =>
    defer(() =>
      from(
        request(`/jetlinks/edge/operations/${deviceId}/device-function-invoke/invoke`, {
          method: 'POST',
          data: params
        }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp),
      ),
    );

  public eventCount = (id: string, event: string) =>
    defer(() =>
      from(
        request(`/jetlinks/device/instance/${id}/event/${event}?format=true`, {
          method: 'GET',
          params: encodeQueryParam({
            pageSize: 1,
          }),
        }),
      ).pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result.total),
      ),
    );

  public updateProperty = (deviceId: string, data: any) =>
    defer(() =>
      from(
        request(`/jetlinks/device/instance/${deviceId}/property`, {
          method: 'PUT',
          data,
        }),
      ).pipe(filter(resp => resp.status === 200)),
    );

  public getLogType = () =>
    defer(() =>
      from(
        request(`/jetlinks/dictionary/device-log-type/items`, {
          method: 'GET',
        }),
      ).pipe(filter(resp => resp.status === 200)),
    );
}
export default Service;
