type AliCloudType = {
  id: string;
  name: string;
  bridgeProductKey: string;
  bridgeProductName: string;
  accessConfig: {
    regionId: string;
    accessKeyId: string;
    accessSecret: string;
  };
  state?: {
    text: string;
    value: string;
  };
  mappings: any[];
  description?: string;
};
