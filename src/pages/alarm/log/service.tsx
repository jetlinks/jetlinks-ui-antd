import BaseService from "@/services/crud";
import request from "@/utils/request";
import { defer, from } from "rxjs";
import { filter, map } from "rxjs/operators";

class Service extends BaseService<any>{

    //获取告警记录
    public getAlarmLog = (deviceId: any, data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-alarm-history-page-list/invoke`, {
            method: 'POST',
            data: data
        })).pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
        ));
    //获取产品
    public getDeviceGatewayList = (deviceId: any, data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/device-gateway-list/invoke`, {
            method: 'POST',
            data: data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
            ));
    //获取告警名称
    public getAlarmList = (deviceId: string, data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-alarm-list/invoke`, {
            method: 'POST',
            data: data
        })).pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
        ));
    //获取告警记录详情
    public getAlarmDetail = (deviceId: any, data: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-alarm-history-info/invoke`, {
            method: 'POST',
            data: data
        })).pipe(
                filter(resp => resp.status === 200),
                map(resp => resp.result[0])
        ));
    //设备
    public getDeviceCount = (data?: any) => defer(
        () => from(request(`/jetlinks/edge/operations/local/device-instances-status/invoke`, {
            method: 'POST',
            data
        }))
            .pipe(
                filter(resp => resp.status === 200),
                map(resp => resp)
            ));
    //修改
    public updataAlarmLog = (deviceId: string, params: any) => defer(
        () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-alarm-history-update/invoke`, {
          method: 'POST',
          data: params
        })).pipe(
          filter(resp => resp.status === 200),
          map(resp => resp.result[0])
        ))
}

export default Service;