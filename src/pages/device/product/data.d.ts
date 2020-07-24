// import {  SimpleType } from "@/utils/common";

export class DeviceProduct {
  id: string;

  name: string;

  photoUrl: string;

  classifiedId: string;

  classifiedName: string;

  describe: string;

  classifiedId: string;

  messageProtocol: string;

  protocolName: string;

  protocolId: string;

  configuration: any;

  metadata: string;

  transportProtocol: string;

  networkWay: string;

  deviceType: {
    text: string;
    value: string;
  };

  security: SecurityConfig;

  state: number;

  creatorId: string;

  createTime: number;

  disabled?: boolean;

  oneSecret: boolean;

  deviceKey: string;

  deviceSecret: string;

  orgId: string;

  orgName: string;
}

export interface SecurityConfig {
  secureId: string;
  secureKey: string;
  omos: boolean;
}

export interface DeviceProductPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface DeviceProductListData {
  list: DeviceProduct[];
  pagination: Partial<DeviceProductPagination>;
}

export interface DeviceProductListParams {
  sorter: string;
  status: string;
  name: string;
  pageSize: number;
  currentPage: number;
}

export interface ProductEvents {
}

export interface ProductFunctions {
  id: string;
  name: string;
  async: boolean;
  inputs: {
    id: string;
    name: string;
    valueType: {
      type: string;
    };
  }[];
  output: {
    id: string;
    name: string;
    valueType: {
      type: boolean;
    };
  };
}

export interface ProductProperty {
  id: string;
  name: string;
  readonly: boolean;
  valueType: {
    type: string;
    unit: string;
  };
}
