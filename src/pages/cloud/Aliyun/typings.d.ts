type AliyunItem = {
  id: string;
  name: string;
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
  state: {
    text: string;
    value: string;
  };
};
