import request from '@/utils/request';
import { DeviceProduct } from './data';
import { notification } from 'antd';

export async function list(params: any) {
  return request(`/jetlinks/device-product/_query`, {
    method: 'GET',
    params: params,
  });
}

export async function saveOrUpdate(params: Partial<DeviceProduct>) {
  return request(`/jetlinks/device-product`, {
    method: 'PATCH',
    data: params,
  });
}

export async function saveDeviceProduct(params: Partial<DeviceProduct>) {
  return request(`/jetlinks/device-product`, {
    method: 'POST',
    data: params,
  });
}

export async function update(params: DeviceProduct, productId?: string) {
  return request(`/jetlinks/device-product/${productId}`, {
    method: 'PUT',
    data: params,
  });
}

export async function info(id: string) {
  return request(`/jetlinks/device-product/${id}`, {
    method: 'GET',
  });
}

export async function remove(id: string) {
  return request(`/jetlinks/device-product/${id}`, {
    method: 'DELETE',
  });
}

export async function count(params: any) {
  return request(`/jetlinks/device-product/_count`, {
    method: 'GET',
    params: params,
  });
}

export async function query(params: any) {
  return request(`/jetlinks/device-product/_query`, {
    method: 'GET',
    params: params,
  });
}

export async function queryNoPagin(params?: any) {
  return request(`/jetlinks/device-product/_query/no-paging`, {
    method: 'GET',
    params: params,
  });
}

export async function deleteById(id: string) {
  return request(`/jetlinks/device-product/${id}`, {
    method: 'DELETE',
  });
}

//消息协议
export async function protocolSupport() {
  return request(`/jetlinks/protocol/supports`, {
    method: 'GET',
  });
}

//链接协议
export async function protocolTransports(id: string) {
  return request(`/jetlinks/protocol/${id}/transports`, {
    method: 'GET',
  });
}

//协议配置
export async function protocolConfiguration(support: string, transport: string) {
  return request(`/jetlinks/protocol/${support}/${transport}/configuration`, {
    method: 'GET',
  });
}

//产品协议配置
export async function productConfiguration(productId: string) {
  return request(`/jetlinks/device/product/${productId}/config-metadata`, {
    method: 'GET',
  });
}

//设备协议配置
export async function deviceConfiguration(deviceId: string) {
  return request(`/jetlinks/device/instance/${deviceId}/config-metadata`, {
    method: 'GET',
  });
}

//发布状态切换
export async function deploy(id: string) {
  return request(`/jetlinks/device-product/${id}/deploy`, {
    method: 'POST',
    data: {},
  });
}

//发布状态切换
export async function unDeploy(id: string) {
  return request(`/jetlinks/device-product/${id}/undeploy`, {
    method: 'POST',
    data: {},
  });
}

//获取机构
export async function queryOrganization() {
  return request(`/jetlinks/organization/_all`, {
    method: 'get',
  });
}

//获取机构  /_query/_children/tree
export async function queryOrganization_children(params: any) {
  return request(`/jetlinks/organization/_query/_children`, {
    method: 'get',
    params: params,
  });
}

export async function units() {
  return request(`/jetlinks/protocol/units`, {
    method: 'get',
  });
}

//获取品类分类
export async function deviceCategory() {
  return request(`/jetlinks/device/category`, {
    method: 'get',
  });
}

//获取品类分类
export async function deviceCategoryNoPaing() {
  return request(`/jetlinks/device/category/_query/no-paging?paging=false`, {
    method: 'get',
  });
}

export async function deviceCategoryTree(params: any) {
  return request(`/jetlinks/device/category/_tree`, {
    params,
    method: 'get',
  });
}

export async function storagePolicy() {
  return request(`/jetlinks/device/product/storage/policies`, {
    method: 'get',
  });
}

//获取云对云下拉列表
export async function deviceBind() {
  return request(`/jetlinks/device/instance/bind-providers`, {
    method: 'get',
  });
}

export async function configMetadata(params: {
  productId: string;
  modelType: string;
  modelId: string;
  typeId: string;
}) {
  return request(
    `/jetlinks/device/product/${params.productId}/config-metadata/${params.modelType}/${params.modelId}/${params.typeId}`,
    { method: 'GET' },
  );
}

export async function deviceConfigMetadata(params: {
  productId: string;
  modelType: string;
  modelId: string;
  typeId: string;
}) {
  return request(
    `/jetlinks/device/instance/${params.productId}/config-metadata/${params.modelType}/${params.modelId}/${params.typeId}`,
    { method: 'GET' },
  );
}

//获取物模型格式
export async function getModelFormat() {
  return request(`/jetlinks/device/product/metadata/codecs`, {
    method: 'get',
  });
}

//物模型
export async function getModel(id: string, data: any) {
  return request(`/jetlinks/device/product/metadata/convert-from/${id}`, {
    method: 'post',
    data,
  });
}

//物模型
export async function getOtherModel(id: string, data: any) {
  return request(`/jetlinks/device/product/metadata/convert-to/${id}`, {
    method: 'post',
    data,
  });
}

//获取默认物模型
export async function getDefaultModel(id: string, transport: string) {
  return request(`/jetlinks/protocol/${id}/${transport}/metadata`, {
    method: 'get',
    errorHandler: error => {
      const { response } = error;
      if (response.status === 404 || response.status === 500) {
        console.error(response);
      } else {
        notification.error({
          key: 'error',
          message: response.statusText,
        });
      }
    },
  });
}
//获取虚拟属性聚合函数
export async function getAggTypeList() {
  return request(`/jetlinks/dictionary/streaming-agg-type/items`, {
    method: 'get',
  });
}

//解析文件为属性物模型
export async function uploadProperties(fileUrl: string, productId: string) {
  return request(
    `/jetlinks/device/product/${productId}/property-metadata/import?fileUrl=${fileUrl}`,
    {
      method: 'POST',
    },
  );
}
