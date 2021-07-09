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
                map(resp => resp.result[0])
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
        () => from(request(`/jetlinks/edge/operations/rule/rule-engine-alarm-history-status/invoke`, {
            method: 'POST',
            data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp)
            ));
}
export default Service;
