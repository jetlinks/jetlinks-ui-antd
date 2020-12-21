import { SimpleType } from '@/utils/common';

export class DeviceInstance extends SimpleType {
  id: string;

  name: string;

  describe: string;

  productId: string;

  productName: string;

  protocolName: string;

  security: any;

  deriveMetadata: string;

  metadata: string;

  binds: any;

  state: {
    value: string,
    text: string,
  };

  creatorId: string;

  creatorName: string;

  createTime: string;

  registryTime: string;

  disabled?: boolean;

  aloneConfiguration?: boolean;

  deviceType: {
    value: string,
    text: string,
  };

  transportProtocol: string;

  messageProtocol: string;

  orgId: string;

  orgName: string;

  configuration:any;

  cachedConfiguration: any;

  transport:string;

  protocol:string;

  address:string;

  registerTime:string;

  onlineTime:string;

  tags:any;
}

export interface DeviceInstancePagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface DeviceInstanceListData {
  list: DeviceInstance[];
  pagination: Partial<DeviceInstancePagination>;
}
