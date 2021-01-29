import BaseService from "@/services/crud";
import request from "@/utils/request";
import {defer, from} from "rxjs";
import {filter, map} from "rxjs/operators";

class Service extends BaseService<any> {

  public _enabled = (cascadeId: string) => defer(
    () => from(request(`/jetlinks/media/gb28181-cascade/${cascadeId}/_enabled`, {
      method: 'POST',
    })).pipe(
      filter(resp => resp.status === 200),
      map(resp => resp.result)
    ));

  public _disabled = (cascadeId: string) => defer(
    () => from(request(`/jetlinks/media/gb28181-cascade/${cascadeId}/_disabled`, {
      method: 'POST',
    })).pipe(
      filter(resp => resp.status === 200),
      map(resp => resp.result)
    ));

  public saveCascade = (data: any) => defer(
    () => from(request(`/jetlinks/media/gb28181-cascade/`, {
      method: 'PATCH',
      data: data
    }))
      .pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result)
      ));
}

export default Service;
