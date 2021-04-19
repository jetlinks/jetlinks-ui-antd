import BaseService from "@/services/crud";
import request from "@/utils/request";
import { defer, from } from "rxjs";
import { filter, map } from "rxjs/operators";

class Service extends BaseService<any> {

    public getProductList = (params: any) => defer(
        () => from(request(`/jetlinks/device-product/_query/no-paging?paging=false`, {
            method: 'GET',
            params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result)
        ));

    public saveDeviceGateway = (deviceId: string, params: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/device-gateway-save/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ));

    public start = (deviceId: any, id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/device-gateway-start/invoke`, {
            method: 'POST',
            data: {
                id: id
            }
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp)
            ));

    public stop = (deviceId: any, id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/device-gateway-stop/invoke`, {
            method: 'POST',
            data: {
                id: id
            }
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp)
            ));
    public del = (deviceId: any, id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/device-gateway-delete/invoke`, {
            method: 'POST',
            data: {
                id: id
            }
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp)
            ));

    public getDeviceGatewayList = (deviceId: any, data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/device-gateway-list/invoke`, {
            method: 'POST',
            data: data
        }))
            .pipe(
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

    public getDeviceList = (deviceId: string, params?: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/device-instance-page-list/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result[0])
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

    public insertDevice = (deviceId: string, params?: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/device-instance-insert/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ));

    public saveDevice = (deviceId: string, params?: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/device-instance-save/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ));

    public deployDevice = (deviceId: string, id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/device-instance-deploy/invoke`, {
            method: 'POST',
            data: {
                deviceId: id
            }
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ));

    public undeployDevice = (deviceId: string, id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/device-instance-undeploy/invoke`, {
            method: 'POST',
            data: {
                deviceId: id
            }
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ));
    public delIinstance = (deviceId: string, id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/device-instance-delete/invoke`, {
            method: 'POST',
            data: {
                deviceId: id
            }
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ));
    public getInstanceDetail = (deviceId: string, id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/device-instance-detail/invoke`, {
            method: 'POST',
            data: {
                deviceId: id
            }
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result[0])
        ))
    public getIinstanceConfigMetadata = (deviceId: string, id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/device-config-metadata/invoke`, {
            method: 'POST',
            data: {
                deviceId: id
            }
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result[0])
        ))

    //协议
    public getProtocolList = (deviceId: string, params: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/protocol-list/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result[0])
        ))
    public getPlatformProtocolList = () => defer(
        () => from(request(`/jetlinks/protocol/_query/no-paging?paging=false`, {
            method: 'GET'
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ))
    public addProtocol = (deviceId: string, params: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/protocol-add/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ))
}
export default Service;