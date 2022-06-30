import BaseService from '@/utils/BaseService';
import type { ProductItem } from '@/pages/device/Product/typings';
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
              map((count: any) => ({ ...t, count: count.result })),
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

  // public getMetadataConfig = (params: {
  //   deviceId: string;
  //   metadata: {
  //     type: MetadataType | 'property';
  //     id: string;
  //     dataType: string;
  //   };
  // }) =>
  //   defer(() =>
  //     from(
  //       request(
  //         `/${SystemConst.API_BASE}/device/product/${params.deviceId}/config-metadata/${params.metadata.type}/${params.metadata.id}/${params.metadata.dataType}`,
  //       ),
  //     ),
  //   ).pipe(
  //     filter((resp) => resp.status === 200),
  //     map((resp) => resp.result),
  //   );

  // public getUnit = () =>
  //   request(`/${SystemConst.API_BASE}/protocol/units`, {
  //     method: 'GET',
  //   });

  // public saveProduct = (data: Record<string, unknown>) =>
  //   request(`/${SystemConst.API_BASE}/device-product`, {
  //     method: 'PATCH',
  //     data,
  //   });

  public changeDeploy = (id: string, state: 'deploy' | 'undeploy') =>
    defer(() =>
      from(
        request(`${this.uri}/${id}/${state}`, {
          method: 'POST',
        }),
      ),
    ).pipe(
      filter((resp: any) => resp.status === 200),
      map((resp: any) => resp.result),
    );

  public codecs = () =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/device/product/metadata/codecs`, {
          method: 'GET',
        }),
      ),
    ).pipe(
      filter((resp: any) => resp.status === 200),
      map((resp: any) => resp.result),
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
      filter((resp: any) => resp.status === 200),
      map((resp: any) => resp.result),
    );

  public productAlarm = (id: string) =>
    request(`/${SystemConst.API_BASE}/device/alarm/product/${id}`, {
      method: 'GET',
    });

  public category = () =>
    request(`/${SystemConst.API_BASE}/device/category/_tree?paging=false`, {
      method: 'GET',
      params: encodeQuery({ sorts: { sortIndex: 'asc' } }),
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

  public getNetwork = (params: any) =>
    request(`/${SystemConst.API_BASE}/network/config/_query/`, {
      method: 'GET',
      params,
    });

  //上传物模型属性
  public importProductProperty = (productId: string, fileUrl: string) =>
    request(
      `/${SystemConst.API_BASE}/device/product/${productId}/property-metadata/import?fileUrl=${fileUrl}`,
      {
        method: 'POST',
      },
    );

  public existsID = (id: string) => request(`${this.uri}/${id}/exists`, { method: 'GET' });

  //接入网关
  public queryGatewayList = () =>
    request(`/${SystemConst.API_BASE}/gateway/device/_query/no-paging`, {
      method: 'POST',
      data: {
        paging: false,
      },
    });
  //获取协议详情
  public getProtocolDetail = (id: string) =>
    request(`/${SystemConst.API_BASE}/protocol/${id}/detail`, {
      method: 'POST',
    });
}

export default Service;
