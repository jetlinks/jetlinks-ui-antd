import { request } from 'umi';
import { defer, from } from 'rxjs';
import SystemConst from '@/utils/const';
import { filter, map } from 'rxjs/operators';

class LinkService {
  public getProviders = () =>
    defer(() =>
      from(
        request(`${SystemConst.API_BASE}/gateway/device/providers`, {
          method: 'GET',
        }),
      ),
    ).pipe(
      filter((item) => item.status === 200),
      map((item) => item.result),
    );

  public getSupports = () => {
    defer(() =>
      from(
        request(`${SystemConst.API_BASE}/protocol/supports`, {
          method: 'GET',
        }),
      ),
    );
  };
}

const linkService = new LinkService();
export default linkService;
