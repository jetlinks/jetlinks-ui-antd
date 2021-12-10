import BaseService from '@/utils/BaseService';
import { request } from '@@/plugin-request/request';
import SystemConst from '@/utils/const';
import type { MetadataType } from '@/pages/device/Product/typings';
import { defer, from } from 'rxjs';
import { filter, map } from 'rxjs/operators';

class Service extends BaseService<any> {
  public saveProductMetadata = (data: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device-product`, {
      method: 'PATCH',
      data,
    });

  public saveDeviceMetadata = (id: string, data: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device/instance/${id}/metadata`, {
      method: 'PUT',
      data,
    });

  public getMetadataConfig = (params: {
    deviceId: string;
    metadata: {
      type: MetadataType | 'property';
      id: string;
      dataType: string;
    };
  }) =>
    defer(() =>
      from(
        request(
          `/${SystemConst.API_BASE}/device/product/${params.deviceId}/config-metadata/${params.metadata.type}/${params.metadata.id}/${params.metadata.dataType}`,
        ),
      ),
    ).pipe(
      filter((resp) => resp.status === 200),
      map((resp) => resp.result),
    );

  public getUnit = () =>
    request(`/${SystemConst.API_BASE}/protocol/units`, {
      method: 'GET',
    });
}

export default Service;
