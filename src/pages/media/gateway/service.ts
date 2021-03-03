import BaseService from "@/services/crud";
import request from "@/utils/request";
import {defer, from} from "rxjs";
import {filter, map} from "rxjs/operators";

class Service extends BaseService<any> {

  public queryProduct = (params: any) => defer(
    () => from(request(`/jetlinks/device/product/_query/no-paging?paging=false`, {
      method: 'GET',
      params
    })).pipe(
      filter(resp => resp.status === 200),
      map(resp => resp.result)
    ));

  public _enabled = (id: string) => defer(
    () => from(request(`/jetlinks/media/gateway/${id}/_enabled`, {
      method: 'POST'
    }))
      .pipe(
        filter(resp => resp.status === 200),
        map(resp => resp)
      ));

  public _disabled = (id: string) => defer(
    () => from(request(`/jetlinks/media/gateway/${id}/_disabled`, {
      method: 'POST'
    }))
      .pipe(
        filter(resp => resp.status === 200),
        map(resp => resp)
      ));

  public mediaServer = (params: any) => defer(
    () => from(request(`/jetlinks/media/server/_query/no-paging?paging=false`, {
      method: 'GET',
      params
    }))
      .pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result)
      ));

  public gatewayInfo = (id: string) => defer(
    () => from(request(`/jetlinks/media/gateway/${id}`, {
      method: 'GET',
      errorHandler: () => {
      }
    }))
      .pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result)
      ));

  public saveGateway = (data: any) => defer(
    () => from(request(`/jetlinks/media/gateway/`, {
      method: 'PATCH',
      data: data
    }))
      .pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result)
      ));
}

export default Service;
