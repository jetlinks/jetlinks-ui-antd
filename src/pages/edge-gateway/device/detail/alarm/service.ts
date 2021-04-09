import BaseService from "@/services/crud";
import request from "@/utils/request";
import { defer, from } from "rxjs";
import { filter, map } from "rxjs/operators";

class Service extends BaseService<any> {

  public getAlarmsList = (deviceId: string, params: any) => defer(
    () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-alarm-page-list/invoke`, {
      method: 'POST',
      data: params
    })).pipe(
      filter(resp => resp.status === 200),
      map(resp => resp.result[0])
    ));
  public saveAlarms = (deviceId: string, params: any) => defer(
    () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-alarm-save/invoke`, {
      method: 'POST',
      data: params
    })).pipe(
      filter(resp => resp.status === 200),
      map(resp => resp.result[0])
    ));

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
  public _remove = (deviceId: string, params: any) => defer(
    () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-alarm-delete/invoke`, {
      method: 'POST',
      data: params
    })).pipe(
      filter(resp => resp.status === 200),
      map(resp => resp.result[0])
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

  public getAlarmLogList = (deviceId: string, params: any) => defer(
    () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-alarm-history-page-list/invoke`, {
      method: 'POST',
      data: params
    })).pipe(
      filter(resp => resp.status === 200),
      map(resp => resp.result[0])
    ))

  public updataAlarmLog = (deviceId: string, params: any) => defer(
    () => from(request(`/jetlinks/edge/operations/${deviceId}/rule-engine-alarm-history-update/invoke`, {
      method: 'POST',
      data: params
    })).pipe(
      filter(resp => resp.status === 200),
      map(resp => resp.result[0])
    ))
  
  public getProductInfo = (deviceId: string, params: any) => defer(
    () => from(request(`/jetlinks/edge/operations/${deviceId}/device-product-info/invoke`,{
      method: 'POST',
      data: params
    })).pipe(
      filter(resp => resp.status === 200),
      map(resp => resp.result[0])
    ))
}
export default Service;
