import BaseService from '@/utils/BaseService';
import type { ProductItem } from '@/pages/device/Product/typings';
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
}

export default Service;
