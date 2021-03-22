import BaseService from "@/services/crud";
import request from "@/utils/request";
import {defer, from} from "rxjs";
import {filter, map} from "rxjs/operators";

class Service extends BaseService<any> {

  public mediaServerList = (deviceId: string) => defer(
    () => from(request(`/jetlinks/edge/operations/${deviceId}/media-server-list/invoke`, {
      method: 'POST',
      data: {}
    }))
      .pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result[0])
      ));

  public mediaServerInfo = (id: string) => defer(
    () => from(request(`/jetlinks/media/server/${id}`, {
      method: 'GET',
      errorHandler: () => {
      }
    }))
      .pipe(
        filter(resp => resp.status === 200 || resp.status === 404),
        map(resp => resp.result)
      ));

  public saveMediaServer = (deviceId: string, data: any) => defer(
    () => from(request(`/jetlinks/edge/operations/${deviceId}/media-server-save/invoke`, {
      method: 'POST',
      data: data
    }))
      .pipe(
        filter(resp => resp.status === 200),
        map(resp => resp.result)
      ));
}

export default Service;
