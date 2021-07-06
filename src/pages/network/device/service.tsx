import BaseService from "@/services/crud";
import request from "@/utils/request";
import { defer, from } from "rxjs";
import { filter, map } from "rxjs/operators";

class Service extends BaseService<any> {

    public getDeviceGatewayList = (data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-gateway-list/invoke`, {
            method: 'POST',
            data: data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
            ));

    public getDeviceList = (params?: any) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-instance-page-list/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result[0])
        ));



    public getGatewaytypeList = (deviceId: string, transportProtocol: string) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/device-gateway-providers/invoke`, {
            method: 'POST',
            data: {
                transportProtocol: transportProtocol
            }
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
            ));


    public getNetworkConfigList = (deviceId: any, data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/network-config-list/invoke`, {
            method: 'POST',
            data: data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
            ));

    public getNetworkConfigInfo = (deviceId: string, id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/network-config-info/invoke`, {
            method: 'POST',
            data: {
                id: id
            }
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result[0])
        ));

    public getProtocolInfo = (id: string) => defer(
        () => from(request(`/jetlinks/protocol/${id}`, {
            method: 'GET',
            errorHandler: () => { }
        })).pipe(
            map(resp => resp?.result)
        ));

    public getSupportList = () => defer(
        () => from(request(`/jetlinks/protocol/supports`, {
            method: 'GET',
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result)
        ));



    public getDeviceInfo = (deviceId: string, id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/device-instance-info/invoke`, {
            method: 'POST',
            data: {
                id: id
            }
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result[0])
        ));

    public insertDevice = (params?: any) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-instance-insert/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ));

    public saveDevice = (params?: any) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-instance-save/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ));

    public deployDevice = (id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-instance-deploy/invoke`, {
            method: 'POST',
            data: {
                deviceId: id
            }
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ));

    public undeployDevice = (id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-instance-undeploy/invoke`, {
            method: 'POST',
            data: {
                deviceId: id
            }
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ));
    public delIinstance = (id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-instance-delete/invoke`, {
            method: 'POST',
            data: {
                deviceId: id
            }
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ));
    public getInstanceDetail = (id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-instance-detail/invoke`, {
            method: 'POST',
            data: {
                deviceId: id
            }
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result[0])
        ))
    public getIinstanceConfigMetadata = (id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-config-metadata/invoke`, {
            method: 'POST',
            data: {
                deviceId: id
            }
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result[0])
        ))
    public getDeviceCount = (data?: any) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-instances-status/invoke`, {
            method: 'POST',
            data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp)
            ));
}
export default Service;