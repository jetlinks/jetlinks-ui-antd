import BaseService from "@/services/crud";
import request from "@/utils/request";
import { defer, from } from "rxjs";
import { map } from "rxjs/operators";

class Service extends BaseService<any>{

    public groupTree = (param: any) => defer(
        () => from(request(`/jetlinks/device/group/_query/tree`, {
            method: 'GET',
        })).pipe(
            map(resp => resp.result)
        ));

    public saveGroup = (data: any) => defer(
        () => from(request(`/jetlinks/device/group`, {
            method: 'POST',
            data
        })).pipe(
            map(resp => resp.result)
        ));
    public removeGroup = (id: string) => defer(
        () => from(request(`/jetlinks/device/group/${id}`, {
            method: 'DELETE',
        })).pipe(
            map(resp => resp.result)
        ));

    public groupDevice = (param: any) => defer(
        () => from(request(`/jetlinks/device-instance/_query`, {
            method: 'GET',
            params: param
        })).pipe(
            map(resp => resp.result)
        ));

    public bindDevice = (id: string, deviceId: string[]) => defer(
        () => from(request(`/jetlinks/device/group/${id}/_bind`, {
            method: 'POST',
            data: deviceId,
        })).pipe(
            map(resp => resp.result)
        ));

    public unbindDevice = (id: string, deviceId: string[]) => defer(
        () => from(request(`/jetlinks/device/group/${id}/_unbind`, {
            method: "POST",
            data: deviceId,
        })).pipe(
            map(resp => resp.result)
        ));
}

export default Service;
