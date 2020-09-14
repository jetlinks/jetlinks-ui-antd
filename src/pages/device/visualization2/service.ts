
import BaseService from "@/services/crud";
import { defer, from } from "rxjs";
import { filter, map } from "rxjs/operators";
import request from "@/utils/request";

class Service extends BaseService<any>{
    public propertySource = (deviceId: string, propertyId: string) =>
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

    public getLayout = (params: any) => defer(() =>
        from(request(
            `/jetlinks/visualization/${params.type}/${params.target}`,
            { method: 'GET', }
        )).pipe(
            filter(resp => resp.status),
            map(resp => resp.result)
        ));

    public getDashboardData = (params: any[]) => defer(() =>
        from(request(
            `/jetlinks/dashboard/_multi`,
            {
                method: 'POST',
                data: params
            }
        )).pipe(
            map(resp => resp.result)
        ));

}
export default Service;