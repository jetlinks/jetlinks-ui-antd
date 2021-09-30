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

  public saveRoleBind = (data: BindDataItem[]) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/dimension-user`, {
          method: 'PATCH',
          data,
        }),
      ),
    );

  public unBindRole = (data: string[], dimensionType: string, dimensionId: string) =>
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

  public saveOrgBind = (data: string[], orgId: string) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/organization/${orgId}/users/_bind`, {
          method: 'POST',
          data,
        }),
      ),
    );

  public unBindOrg = (data: string[], orgId: string) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/organization/${orgId}/users/_unbind`, {
          method: 'POST',
          data,
        }),
      ),
    );
}

export default Service;
