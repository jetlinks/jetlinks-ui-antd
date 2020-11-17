import BaseService from "@/services/crud";
import request from "@/utils/request";
import { message } from "antd";
import { defer, from } from "rxjs";
import { filter, map } from "rxjs/operators";

class Service extends BaseService<any>{

    public groupList = (params: any) => defer(
        () => from(request(`/jetlinks/device/group/_query`, {
            method: 'GET',
            params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result)
        ));

    public groupTree = (params: any) => defer(
        () => from(request(`/jetlinks/device/group/_query/_children/tree`, {
            method: 'GET',
            params,
            errorHandler: () => message.error('服务器错误！')
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result)
        ));

    public saveGroup = (data: any) => defer(
        () => from(request(`/jetlinks/device/group`, {
            method: 'PATCH',
            data,
            errorHandler: (res) => { message.error(res.data.message) }
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result)
        ));
    public removeGroup = (id: string) => defer(
        () => from(request(`/jetlinks/device/group/${id}`, {
            method: 'DELETE',
            errorHandler: (res) => { message.error(res.data.message) }
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result)
        ));

    public groupDevice = (param: any) => defer(
        () => from(request(`/jetlinks/device-instance/_query`, {
            method: 'GET',
            params: param
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result)
        ));

    public bindDevice = (id: string, deviceId: string[]) => defer(
        () => from(request(`/jetlinks/device/group/${id}/_bind`, {
            method: 'POST',
            data: deviceId,
            errorHandler: (res) => { message.error(res.data.message) }
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result)
        ));

    public unbindDevice = (id: string, deviceId: string[]) => defer(
        () => from(request(`/jetlinks/device/group/${id}/_unbind`, {
            method: "POST",
            data: deviceId,
            errorHandler: (res) => { message.error(res.data.message) }
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result)
        ));

    public unbindAll = (id: string) => defer(
        () => from(request(`/jetlinks/device/group/${id}/_unbind/all`, {
            method: 'POST',
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result)
        ));

    public unbind = (groupId: string, id: string[]) => defer(
        () => from(request(`/jetlinks/device/group/${groupId}/_unbind`, {
            method: 'POST',
            data: id
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result)
        ));

}

export default Service;
