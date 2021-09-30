import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';
import { defer, from } from 'rxjs';

class Service extends BaseService<UserItem> {
  public getUser = (params: Record<string, unknown>) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/user/_query`, {
          method: 'GET',
          params,
        }),
      ),
    );

  public saveBindData = (data: BindDataItem[]) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/dimension-user`, {
          method: 'PATCH',
          data,
        }),
      ),
    );

  public unBindData = (data: string[], dimensionType: string, dimensionId: string) =>
    defer(() =>
      from(
        request(
          `/${SystemConst.API_BASE}/dimension-user/user/${dimensionType}/${dimensionId}/_unbind`,
          {
            method: 'POST',
            data,
          },
        ),
      ),
    );
}

export default Service;
