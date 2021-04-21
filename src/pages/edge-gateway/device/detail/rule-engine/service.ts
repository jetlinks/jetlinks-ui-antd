import BaseService from "@/services/crud";
import request from "@/utils/request";
import { defer, from } from "rxjs";
import { filter, map } from "rxjs/operators";

class Service extends BaseService<any> {

    public saveRuleInstance = (deviceId: string, params: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-instance-save/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result)
        ));

    public getRuleInstanceList = (deviceId: any, data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-instance-list/invoke`, {
            method: 'POST',
            data: data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
            ));

    public getRuleInstanceInfo = (deviceId: string, ruleInstanceId: string) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-instance-info/invoke`, {
            method: 'POST',
            data: {
                ruleInstanceId: ruleInstanceId
            }
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result)
            ));

    public delRuleInstance = (deviceId: string, ruleInstanceId: string) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-instance-delete/invoke`, {
            method: 'POST',
            data: {
                ruleInstanceId: ruleInstanceId
            }
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result)
            ));
    //设备告警启动停止
    public _start = (deviceId: string, params: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-alarm-start/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result[0])
        ));
    public _stop = (deviceId: string, params: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-alarm-stop/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result[0])
        ));

    public startRuleInstance = (deviceId: string, ruleInstanceId: string) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-instance-start/invoke`, {
            method: 'POST',
            data: {
                ruleInstanceId: ruleInstanceId
            }
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result)
            ));

    public stopRuleInstance = (deviceId: string, ruleInstanceId: string) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-instance-stop/invoke`, {
            method: 'POST',
            data: {
                ruleInstanceId: ruleInstanceId
            }
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result)
            ));
    public getRuleInstanceLogsList = (deviceId: any, data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-execute-logs/invoke`, {
            method: 'POST',
            data: data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
            ));
    public getRuleInstanceEventsList = (deviceId: any, data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-execute-events/invoke`, {
            method: 'POST',
            data: data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
            ));

    public saveScene = (deviceId: string, params: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-scene-save/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ));

    public getScenePageList = (deviceId: any, data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-scene-page-list/invoke`, {
            method: 'POST',
            data: data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
            ));
    public getSceneList = (deviceId: any, data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-scene-list/invoke`, {
            method: 'POST',
            data: data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
            ));
    public getSceneInfo = (deviceId: any, data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-scene-info/invoke`, {
            method: 'POST',
            data: data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
            ));
    public stopScene = (deviceId: any, data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-scene-stop/invoke`, {
            method: 'POST',
            data: data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
            ));
    public startScene = (deviceId: any, data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-scene-start/invoke`, {
            method: 'POST',
            data: data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
            ));
    public delScene = (deviceId: any, data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-scene-delete/invoke`, {
            method: 'POST',
            data: data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
            ));
    public executeScene = (deviceId: any, data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-scene-execute/invoke`, {
            method: 'POST',
            data: data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
            ));
    public getNotifierTypeList = (deviceId: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/notifier-type-list/invoke`, {
            method: 'POST',
            data: {}
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
            ));
    public getNotifierProviderList = (deviceId: any, typeId: string) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/notifier-provider-list/invoke`, {
            method: 'POST',
            data: {
                typeId: typeId
            }
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
            ));
    public getNotifierConfigList = (deviceId: any, data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/notifier-config-list/invoke`, {
            method: 'POST',
            data: data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
            ));
    public getNotifierTemplateList = (deviceId: any, data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/notifier-template-list/invoke`, {
            method: 'POST',
            data: data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
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
    public saveAlarms = (deviceId: string, params: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-alarm-save/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp)
        ));

    public getDeviceList = (deviceId: string, params?: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/device-instance-page-list/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result[0])
        ));
    public getProductList = (deviceId: string, params?: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/device-product-list/invoke`, {
            method: 'POST',
            data: params
        })).pipe(
            filter(resp => resp.status === 200),
            map(resp => resp.result[0])
        ));
}

export default Service;