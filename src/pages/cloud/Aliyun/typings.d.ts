import type { BaseItem, State } from '@/utils/typings';

type AliyunItem = {
  accessConfig: {
    bridgeDeviceName: string;
    bridgeDeviceSecret: string;
    bridgeProductKey: string;
    http2Endpoint: string;
    serverId: string;
  };
  bridgeConfigs: {
    accessKeyId: string;
    accessSecret: string;
    apiEndpoint: string;
    authEndpoint: string;
    productKey: string;
    regionId: string;
  };
  codecProtocol: string;
  createTime: number;
  state: State;
} & BaseItem;
