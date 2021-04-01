import BaseService from '@/services/crud';
import request from '@/utils/request';
import { defer, from, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
class Service extends BaseService<any> {
  public queryTree = (params: any) =>
    defer(() =>
      from(
        request(`${this.uri}/_query/tree?paging=false`, {
          method: 'GET',
          params,
        }),
      ),
    ).pipe(
      map(resp => resp.result),
      catchError(error => of(error)),
    );
}

export default Service;
