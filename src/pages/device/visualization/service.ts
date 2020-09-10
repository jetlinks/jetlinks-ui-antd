import request from '@/utils/request';
import { VisualizationItem } from './data';

export async function saveOrUpdate(params: VisualizationItem) {
    return request(`/jetlinks/visualization`, {
        method: 'PATCH',
        data: params,
    });
}

export async function getLayout(params: any) {
    return request(`/jetlinks/visualization/${params.type}/${params.target}`, {
        method: 'GET',
    })
}

export async function getDashboardData(params: any[]) {
    return request(`/jetlinks/dashboard/_multi`, {
        method: 'POST',
        data: params
    })
}
import BaseService from "@/services/crud";
import { defer, from } from "rxjs";
import { map } from "rxjs/operators";

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

}
export default Service;