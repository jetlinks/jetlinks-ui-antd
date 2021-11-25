import BaseService from '@/utils/BaseService';
import type { MetadataType, ProductItem } from '@/pages/device/Product/typings';
import { request } from 'umi';
import SystemConst from '@/utils/const';
import { concatMap, defer, from, toArray } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import encodeQuery from '@/utils/encodeQuery';
import type { PageResult, Response } from '@/utils/typings';
import _ from 'lodash';

class Service extends BaseService<ProductItem> {
  public instanceCount = (params: Record<string, any>) =>
    request(`/${SystemConst.API_BASE}/device-instance/_count`, { params, method: 'GET' });

  public queryZipCount = (params: any) =>
    from(this.query(params)).pipe(
      concatMap((i: Response<ProductItem>) =>
        from((i.result as PageResult)?.data).pipe(
          concatMap((t: ProductItem) =>
            from(this.instanceCount(encodeQuery({ terms: { productId: t.id } }))).pipe(
              map((count) => ({ ...t, count: count.result })),
            ),
          ),
          toArray(),
          map((data) => _.set(i, 'result.data', data) as any),
        ),
      ),
    );

  public getConfigMetadata = (id: string) =>
    request(`/${SystemConst.API_BASE}/device/product/${id}/config-metadata`, { method: 'GET' });

  public getProductDetail = (id: string) =>
    defer(() => from(this.detail(id))).pipe(
      filter((resp) => resp.status === 200),
      map((resp) => resp.result),
    );

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

  public saveProduct = (data: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device-product`, {
      method: 'PATCH',
      data,
    });

  public changeDeploy = (id: string, state: 'deploy' | 'undeploy') =>
    defer(() =>
      from(
        request(`${this.uri}/${id}/${state}`, {
          method: 'POST',
        }),
      ),
    ).pipe(
      filter((resp) => resp.status === 200),
      map((resp) => resp.result),
    );

  public codecs = () =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/device/product/metadata/codecs`, {
          method: 'GET',
        }),
      ),
    ).pipe(
      filter((resp) => resp.status === 200),
      map((resp) => resp.result),
    );

  public convertMetadata = (direction: 'from' | 'to', type: string, data: any) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/device/product/metadata/convert-${direction}/${type}`, {
          method: 'POST',
          data,
        }),
      ),
    ).pipe(
      filter((resp) => resp.status === 200),
      map((resp) => resp.result),
    );

  public productAlarm = (id: string) =>
    request(`/${SystemConst.API_BASE}/device/alarm/product/${id}`, {
      method: 'GET',
    });

  public notifier = {
    types: () =>
      request(`/${SystemConst.API_BASE}/notifier/config/types`, {
        method: 'GET',
      }),
    config: (params: Record<string, unknown>) =>
      request(`/${SystemConst.API_BASE}/notifier/config/_query/no-paging`, {
        method: 'GET',
        params,
      }),
    template: (params: Record<string, unknown>) =>
      request(`/${SystemConst.API_BASE}/notifier/template/_query/no-paging`, {
        method: 'GET',
        params,
      }),
  };

  public deviceDetail = (id: string) =>
    request(`/${SystemConst.API_BASE}/device/instance/${id}/detail`, {
      method: 'GET',
    });

  public saveAlarm = (id: string, data: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device/alarm/product/${id}`, {
      method: 'PATCH',
      data,
    });

  public category = () =>
    request(`/${SystemConst.API_BASE}/device/category/_tree?paging=false`, {
      method: 'GET',
      params: encodeQuery({ sorts: { id: 'desc' } }),
    });

  public getOrg = () =>
    request(`/${SystemConst.API_BASE}/organization/_all`, {
      method: 'GET',
    });

  public getProtocol = () =>
    request(`/${SystemConst.API_BASE}/protocol/supports`, {
      method: 'GET',
    });

  public getStorage = () =>
    request(`/${SystemConst.API_BASE}/device/product/storage/policies`, {
      method: 'GET',
    });

  public getTransport = (protocol: string) =>
    request(`/${SystemConst.API_BASE}/protocol/${protocol}/transports`, {
      method: 'GET',
    });
}

export default Service;
