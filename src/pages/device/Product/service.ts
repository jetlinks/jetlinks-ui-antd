import BaseService from '@/utils/BaseService';
import type { MetadataType, ProductItem } from '@/pages/device/Product/typings';
import { request } from 'umi';
import SystemConst from '@/utils/const';
import { concatMap, defer, from, toArray } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import encodeQuery from '@/utils/encodeQuery';
import type { Response } from '@/utils/typings';
import _ from 'lodash';

class Service extends BaseService<ProductItem> {
  public instanceCount = (params: Record<string, any>) =>
    request(`/${SystemConst.API_BASE}/device-instance/_count`, { params, method: 'GET' });

  public list = (params: any) =>
    from(this.query(params)).pipe(
      concatMap((i: Response<ProductItem>) =>
        from(i.result.data as ProductItem[]).pipe(
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
}

export default Service;
