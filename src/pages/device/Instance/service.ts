import BaseService from '@/utils/BaseService';
import { request } from 'umi';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import SystemConst from '@/utils/const';
import { defer, from } from 'rxjs';
import { map } from 'rxjs/operators';

class Service extends BaseService<DeviceInstance> {
  public detail = (id: string) => request(`${this.uri}/${id}/detail`, { method: 'GET' });

  // 查询产品列表
  public getProductList = (params?: any) =>
    request(`/${SystemConst.API_BASE}/device/product/_query/no-paging?paging=false`, {
      method: 'GET',
      params,
    });

  // 批量删除设备
  public batchDeleteDevice = (params: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/batch/_delete`, {
      method: 'PUT',
      data: params,
    });

  // 启用设备
  public deployDevice = (deviceId: string, params?: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/deploy`, {
      method: 'POST',
      data: params,
    });

  // 禁用设备
  public undeployDevice = (deviceId: string, params?: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/undeploy`, {
      method: 'POST',
      data: params,
    });

  // 断开连接
  public disconnectDevice = (deviceId: string, params?: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/disconnect`, {
      method: 'POST',
      data: params,
    });

  // 批量激活设备
  public batchDeployDevice = (params: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/batch/_deploy`, {
      method: 'PUT',
      data: params,
    });

  // 批量注销设备
  public batchUndeployDevice = (params: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/batch/_undeploy`, {
      method: 'PUT',
      data: params,
    });

  // 激活所有设备
  public deployAllDevice = (params?: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/deploy`, { method: 'GET', params });

  // 同步设备
  public syncDevice = () =>
    request(`/${SystemConst.API_BASE}/device-instance/state/_sync`, { method: 'GET' });

  //验证设备ID是否重复
  public isExists = (id: string) =>
    request(`/${SystemConst.API_BASE}/device-instance/${id}/exists`, { method: 'GET' });

  public getConfigMetadata = (id: string) =>
    request(`${this.uri}/${id}/config-metadata`, { method: 'GET' });

  public getUnits = () => request(`/${SystemConst.API_BASE}/protocol/units`, { method: 'GET' });

  public propertyRealTime = (data: Record<string, unknown>[]) =>
    defer(() =>
      from(
        request(`/${SystemConst.API_BASE}/dashboard/_multi`, {
          method: 'POST',
          data,
        }),
      ).pipe(
        // filter((resp) => resp.status === 200),
        map((resp) => resp),
        // mergeMap((temp: PropertyData[]) => from(temp)),
        // map((item) => ({
        //   timeString: item.data.timeString,
        //   timestamp: item.data.timestamp,
        //   ...item.data.value,
        // })),
        // groupBy((group$) => group$.property),
        // mergeMap((group) => group.pipe(toArray())),
        // map((arr) => ({
        //   list: arr.sort((a, b) => a.timestamp - b.timestamp),
        //   property: arr[0].property,
        // }))
      ),
    );

  public getProperty = (id: string, type: string) =>
    request(`/${SystemConst.API_BASE}/device/standard/${id}/property/${type}`, {
      method: 'GET',
    });

  public setProperty = (deviceId: string, data: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/property`, {
      method: 'PUT',
      data,
    });

  public getPropertyData = (deviceId: string, params: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/properties/_query`, {
      method: 'GET',
      params,
    });

  public getEventCount = (deviceId: string, eventId: string, params: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/event/${eventId}`, {
      method: 'POST',
      data: params,
    });

  public deleteMetadata = (deviceId: string) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/metadata`, {
      method: 'DELETE',
    });

  public invokeFunction = (deviceId: string, functionId: string, data: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device/invoked/${deviceId}/function/${functionId}`, {
      method: 'POST',
      data,
    });

  public queryLog = (deviceId: string, params: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/logs`, {
      method: 'POST',
      data: params,
    });

  public queryLogsType = () =>
    request(`/${SystemConst.API_BASE}/dictionary/device-log-type/items`, {
      method: 'GET',
    });
  public bindDevice = (deviceId: string, data: string[]) =>
    request(`/${SystemConst.API_BASE}/device/gateway/${deviceId}/bind`, {
      method: 'POST',
      data,
    });
  public unbindDevice = (deviceId: string, childrenId: string, data: Record<string, unknown>) =>
    request(`/${SystemConst.API_BASE}/device/gateway/${deviceId}/unbind/${childrenId}`, {
      method: 'POST',
      data,
    });
  public unbindBatchDevice = (deviceId: string, data: string[]) =>
    request(`/${SystemConst.API_BASE}/device/gateway/${deviceId}/unbind`, {
      method: 'POST',
      data,
    });
  public configurationReset = (deviceId: string) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/configuration/_reset`, {
      method: 'PUT',
    });

  public saveTags = (deviceId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/tag`, {
      method: 'PATCH',
      data,
    });
  public delTags = (deviceId: string, id: string) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/tag/${id}`, {
      method: 'DELETE',
    });
  //产品状态
  public queryProductState = (id: string) =>
    request(`/${SystemConst.API_BASE}/device/product/${id}`, {
      method: 'GET',
    });
  // 发布产品
  public deployProduct = (productId: string) =>
    request(`/${SystemConst.API_BASE}/device/product/${productId}/deploy`, {
      method: 'POST',
    });
  // 产品配置
  public queryProductConfig = (id: string) =>
    request(`/${SystemConst.API_BASE}/device/product/${id}/config-metadata`, {
      method: 'GET',
    });
  // 设备配置
  public queryDeviceConfig = (id: string) =>
    request(`/${SystemConst.API_BASE}/device-instance/${id}/config-metadata`, {
      method: 'GET',
    });
  // 设备接入网关状态
  public queryGatewayState = (id: string) =>
    request(`/${SystemConst.API_BASE}/gateway/device/${id}/detail`, {
      method: 'GET',
    });
  public startGateway = (id: string) =>
    request(`/${SystemConst.API_BASE}/gateway/device/${id}/_startup`, {
      method: 'POST',
    });
  //网络组件状态
  public queryNetworkState = (id: string) =>
    request(`/${SystemConst.API_BASE}/network/config/${id}`, {
      method: 'GET',
    });
  //网络组件启用
  public startNetwork = (id: string) =>
    request(`/${SystemConst.API_BASE}/network/config/${id}/_start`, {
      method: 'POST',
    });
  // 执行功能
  public executeFunctions = (deviceId: string, functionId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/device/invoked/${deviceId}/function/${functionId}`, {
      method: 'POST',
      data,
    });
  // 读取属性
  public readProperties = (deviceId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/device/instance/${deviceId}/properties/_read`, {
      method: 'POST',
      data,
    });
  // 设置属性
  public settingProperties = (deviceId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/device/instance/${deviceId}/property`, {
      method: 'PUT',
      data,
    });
  //获取协议设置的默认物模型
  public queryProtocolMetadata = (id: string, transport: string) =>
    request(`/${SystemConst.API_BASE}/protocol/${id}/${transport}/metadata`, {
      method: 'GET',
    });
  // 保存设备物模型映射
  public saveDeviceMetadata = (deviceId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/device/metadata/mapping/device/${deviceId}`, {
      method: 'PATCH',
      data,
    });
  //保存产品物模型映射
  public saveProductMetadata = (productId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/device/metadata/mapping/product/${productId}`, {
      method: 'PATCH',
      data,
    });
  //查询设备物模型映射
  public queryDeviceMetadata = (deviceId: string) =>
    request(`/${SystemConst.API_BASE}/device/metadata/mapping/device/${deviceId}`, {
      method: 'GET',
    });
  //查询产品物模型映射
  public queryProductMetadata = (productId: string) =>
    request(`/${SystemConst.API_BASE}/device/metadata/mapping/product/${productId}`, {
      method: 'GET',
    });
  //
  public queryProcotolDetail = (type: string, transport: string) =>
    request(`/${SystemConst.API_BASE}/protocol/${type}/transport/${transport}`, {
      method: 'GET',
    });

  //接入网关
  public queryGatewayList = () =>
    request(`/${SystemConst.API_BASE}/gateway/device/_query/no-paging`, {
      method: 'POST',
      data: {
        paging: false,
      },
    });
  // 保存设备关系
  public saveRelations = (id: string, data: any) =>
    request(`/${SystemConst.API_BASE}/device/instance/${id}/relations`, {
      method: 'PATCH',
      data,
    });
  // 查询用户
  public queryUserListNopaging = () =>
    request(`/${SystemConst.API_BASE}/user/_query/no-paging`, {
      method: 'POST',
      data: {
        paging: false,
        sorts: [{ name: 'name', order: 'asc' }],
      },
    });
  // 保存设备的物模型指标
  public saveMetric = (deviceId: string, propertyId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/metric/property/${propertyId}`, {
      method: 'PATCH',
      data,
    });
  // 查询设备的物模型指标
  public queryMetric = (deviceId: string, propertyId: string) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/metric/property/${propertyId}`, {
      method: 'GET',
    });
  //聚合查询设备属性
  public queryPropertieInfo = (deviceId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/agg/_query`, {
      method: 'POST',
      data,
    });
  public queryPropertieList = (deviceId: string, property: string, data: any) =>
    request(`/${SystemConst.API_BASE}/device-instance/${deviceId}/property/${property}/_query`, {
      method: 'POST',
      data,
    });
  //获取产品解析规则
  public productCode = (productId: string) =>
    request(`/${SystemConst.API_BASE}/device/transparent-codec/${productId}`, {
      method: 'GET',
    });
  //保存产品解析规则
  public saveProductCode = (productId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/device/transparent-codec/${productId}`, {
      method: 'POST',
      data,
    });
  //获取设备解析规则
  public deviceCode = (productId: string, deviceId: string) =>
    request(`/${SystemConst.API_BASE}/device/transparent-codec/${productId}/${deviceId}`, {
      method: 'GET',
    });
  //保存设备解析规则
  public saveDeviceCode = (productId: string, deviceId: string, data: any) =>
    request(`/${SystemConst.API_BASE}/device/transparent-codec/${productId}/${deviceId}`, {
      method: 'POST',
      data,
    });
  //编码测试
  public testCode = (data: any) =>
    request(`/${SystemConst.API_BASE}/device/transparent-codec/decode-test`, {
      method: 'POST',
      data,
    });
  //获取指定协议
  public getProtocal = (id: string, transport: string) =>
    request(`/${SystemConst.API_BASE}/protocol/${id}/transport/${transport}`, {
      method: 'GET',
    });
  //删除设备解析规则
  public delDeviceCode = (productId: string, deviceId: string) =>
    request(`/${SystemConst.API_BASE}/device/transparent-codec/${productId}/${deviceId}`, {
      method: 'DELETE',
    });
  //删除产品解析规则
  public delProductCode = (productId: string) =>
    request(`/${SystemConst.API_BASE}/device/transparent-codec/${productId}`, {
      method: 'DELETE',
    });
  // 查询设备下点位
  public noPagingOpcua = (data: any) =>
    request(`/${SystemConst.API_BASE}/opc/client/_query/no-paging`, {
      method: 'POST',
      data,
    });
  public queryModbusabyId = (data: any) =>
    request(`/${SystemConst.API_BASE}/modbus/master/_query/no-paging`, {
      method: 'POST',
      data,
    });
}

export default Service;
