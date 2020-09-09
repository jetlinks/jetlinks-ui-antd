import BaseService from "@/services/crud";
import { defer, from } from "rxjs";
import request from "@/utils/request";
import { map } from "rxjs/operators";

class Service extends BaseService<any>{
    public propertyType = (deviceId: string, propertyId: string) =>
        defer(() =>
            from(request(
                `/jetlinks/device/instance/${deviceId}/property/${propertyId}`,
                { method: 'GET' }
            )).pipe(
                map(resp => resp.result),
            ));

    public exec = (deviceId: string, functionId: string, data: any) =>
        defer(() =>
            from(request(
                `/jetlinks/device/instance/${deviceId}/function/${functionId}`,
                { method: 'POST', data }
            )).pipe(
                map(resp => resp.result)
            ));

}
export default Service;