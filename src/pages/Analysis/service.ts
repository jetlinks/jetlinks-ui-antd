import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import SystemConst from '@/utils/const';
import Token from '@/utils/token';
import { defer, from } from 'rxjs';

class Service extends BaseService<unknown> {
  public getMulti = (data: unknown) =>
    defer(() =>
      from(
        request(`${SystemConst.API_BASE}/dashboard/_multi?:X_Access_Token=${Token.get()}`, {
          method: 'POST',
          data,
        }),
      ),
    );
}

export default Service;
