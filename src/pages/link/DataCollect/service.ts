import { request } from 'umi';
import SystemConst from '@/utils/const';

class Service {
  // 点位
  public savePoint = (params: PointItem) =>
    request(`/${SystemConst.API_BASE}/data-collect/point`, {
      method: 'POST',
      data: params,
    });
  public queryPoint = (params: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/point/_query`, {
      method: 'POST',
      data: params,
    });
  public queryPointNoPaging = (params: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/point/_query/no-paging`, {
      method: 'GET',
      params,
    });
  public queryPointCount = (params: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/point/_count`, {
      method: 'POST',
      data: params,
    });
  public queryPointByID = (id: string) =>
    request(`/${SystemConst.API_BASE}/data-collect/point/${id}`, {
      method: 'GET',
    });
  public updatePoint = (id: string, params: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/point/${id}`, {
      method: 'PUT',
      data: params,
    });
  public readPoint = (collectorId: string, data: string[]) =>
    request(`/${SystemConst.API_BASE}data-collect/collector/${collectorId}/points/_read`, {
      method: 'POST',
      data,
    });
  public writePoint = (collectorId: string, data: any[]) =>
    request(`/${SystemConst.API_BASE}data-collect/collector/${collectorId}/points/_write`, {
      method: 'POST',
      data,
    });
  public removePoint = (id: string) =>
    request(`/${SystemConst.API_BASE}/data-collect/point/${id}`, {
      method: 'DELETE',
    });
  // 采集器
  public saveCollector = (params: CollectorItem) =>
    request(`/${SystemConst.API_BASE}/data-collect/collector`, {
      method: 'POST',
      data: params,
    });
  public queryCollector = (params: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/collector/_query`, {
      method: 'POST',
      data: params,
    });
  public queryCollectorCount = (params: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/collector/_count`, {
      method: 'POST',
      data: params,
    });
  public queryCollectorByID = (id: string) =>
    request(`/${SystemConst.API_BASE}/data-collect/collector/${id}`, {
      method: 'GET',
    });
  public updateCollector = (id: string, params: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/collector/${id}`, {
      method: 'PUT',
      data: params,
    });
  public removeCollector = (id: string) =>
    request(`/${SystemConst.API_BASE}/data-collect/collector/${id}`, {
      method: 'DELETE',
    });
  // 通道
  public saveChannel = (params: ChannelItem) =>
    request(`/${SystemConst.API_BASE}/data-collect/channel`, {
      method: 'POST',
      data: params,
    });
  public queryChannel = (params: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/channel/_query`, {
      method: 'POST',
      data: params,
    });
  public queryChannelCount = (params: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/channel/_count`, {
      method: 'POST',
      data: params,
    });
  public queryChannelByID = (id: string) =>
    request(`/${SystemConst.API_BASE}/data-collect/channel/${id}`, {
      method: 'GET',
    });
  public updateChannel = (id: string, params: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/channel/${id}`, {
      method: 'PUT',
      data: params,
    });
  public removeChannel = (id: string) =>
    request(`/${SystemConst.API_BASE}/data-collect/channel/${id}`, {
      method: 'DELETE',
    });
  public queryChannelTree = (params: ChannelItem) =>
    request(`/${SystemConst.API_BASE}/data-collect/channel/_all/tree`, {
      method: 'POST',
      data: params,
    });
  public querySecurityPolicyList = (params?: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/opc/security-policies`, {
      method: 'GET',
      params,
    });

  public querySecurityModesList = (params?: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/opc/security-modes`, {
      method: 'GET',
      params,
    });

  public queryCertificateList = (params?: any) =>
    request(`/${SystemConst.API_BASE}/network/certificate/_query/no-paging?paging=false`, {
      method: 'GET',
      params,
    });

  public queryAuthTypeList = (params?: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/opc/auth-types`, {
      method: 'GET',
      params,
    });

  public scanOpcUAList = (params: any) =>
    request(
      `/${SystemConst.API_BASE}/data-collect/opc/channel/${params.id}/nodes?nodeId=${
        params?.nodeId || ''
      }`,
      {
        method: 'GET',
      },
    );
  public queryCodecProvider = () =>
    request(`/${SystemConst.API_BASE}/things/collector/codecs`, {
      method: 'GET',
    });

  public savePointBatch = (params: any[]) =>
    request(`/${SystemConst.API_BASE}/data-collect/point`, {
      method: 'PATCH',
      data: params,
    });

  public dashboard = (data?: any) =>
    request(`/${SystemConst.API_BASE}/dashboard/_multi`, {
      method: 'POST',
      data,
    });

  public validateField = (data?: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/opc/endpoint/_validate`, {
      method: 'POST',
      data,
    });
  public batchDeletePoint = (params: any) =>
    request(`/${SystemConst.API_BASE}/data-collect/point/batch/_delete`, {
      method: 'POST',
      data: params,
    });
}

const service = new Service();

export default service;
