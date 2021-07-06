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
    public saveDeviceGateway = (params: any) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-gateway-save/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ));

    public getDeviceGatewayInfo = (id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-gateway-info/invoke`, {
            method: 'POST',
            data: {
                id: id
            }
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ));

    public start = (id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-gateway-start/invoke`, {
            method: 'POST',
            data: {
                id: id
            }
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp)
            ));

    public stop = (id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-gateway-stop/invoke`, {
            method: 'POST',
            data: {
                id: id
            }
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp)
            ));
    public del = (id: string) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-gateway-delete/invoke`, {
            method: 'POST',
            data: {
                id: id
            }
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp)
            ));
    public getProductList = ( params: any) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-product-list/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result[0])
        ));
    //获取协议
    public getProtocolList = (params: any) => defer(
        () => from(request(`/jetlinks/edge/operations/local/protocol-list/invoke`, {
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
    public addProtocol = ( params: any) => defer(
        () => from(request(`/jetlinks/edge/operations/local/protocol-add/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ))












    public getGatewaytypeList = (transportProtocol: string) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-gateway-providers/invoke`, {
            method: 'POST',
            data: {
                transportProtocol: transportProtocol
            }
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
            ));


    public getNetworkConfigList = (data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/local/network-config-list/invoke`, {
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
}
export default Service;