import BaseService from '@/utils/BaseService';
import type { ProductItem } from '@/pages/device/Product/typings';
import { request } from 'umi';
import SystemConst from '@/utils/const';
import { from, toArray } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import encodeQuery from '@/utils/encodeQuery';
import type { Response } from '@/utils/typings';
import _ from 'lodash';

class Service extends BaseService<ProductItem> {
  public instanceCount = (params: Record<string, any>) => {
    return request(`/${SystemConst.API_BASE}/device-instance/_count`, { params, method: 'GET' });
  };

  public list = (params: any) =>
    from(this.query(params)).pipe(
      mergeMap((i: Response<ProductItem>) =>
        from(i.result.data as ProductItem[]).pipe(
          mergeMap((t: ProductItem) =>
            from(this.instanceCount(encodeQuery({ terms: { productId: t.id } }))).pipe(
              map((count) => ({ ...t, count: count.result })),
            ),
          ),
          toArray(),
          map((data) => _.set(i, 'result.data', data) as any),
        ),
      ),
    );
}

export default Service;
