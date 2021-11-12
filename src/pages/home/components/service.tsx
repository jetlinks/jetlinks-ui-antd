import BaseService from "@/services/crud";
import request from "@/utils/request";
import { defer, from } from "rxjs";
import { filter, map } from "rxjs/operators";

class Service extends BaseService<any> {

    public getEdgeNetworkList = () => defer(
        () => from(request(`/jetlinks/edge/operations/local/edge-network-list/invoke`, {
            method: 'POST',
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result)
            ));

    public getDeviceCount = (data?: any) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-instances-status/invoke`, {
            method: 'POST',
            data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp)
            ));
    public getAlarmsCount = (data?: any) => defer(
        () => from(request(`/jetlinks/edge/operations/local/rule-engine-alarm-history-status/invoke`, {
            method: 'POST',
            data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp)
            ));
    public saveNetworkConfiguration = (data?: any) => defer(
        () => from(request(`/jetlinks/edge/operations/local/edge-network-save/invoke`, {
            method: 'POST',
            data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp)
            ));
    public editPlateInfo = (data?: any) => defer(
        () => from(request(`/jetlinks/edge/operations/local/edge-base-config-update/invoke`, {
            method: 'POST',
            data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp)
            ));
    //查询网关持久化
    public findPersistence = (data?: any) => defer(
            () => from(request(`/jetlinks/edge/operations/local/edge-persistence-find/invoke`, {
                method: 'POST',
                data
            }))
                .pipe(
                    filter(resp => resp.status === 200),
                    map(resp => resp)
                ));
    //修改网关持久化
    public updatePersistence = (data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/local/edge-persistence-update/invoke`, {
            method: 'POST',
            data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp)
            ));
}
export default Service;