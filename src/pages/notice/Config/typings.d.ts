type ConfigItem = {
  id: string;
  name: string;
  type: string;
  provider: string;
  maxRetryTimes: number;
  creatorId: string;
  createTime: number;
  configuration: Record<string, unknown>;
};

type Provider = {
  type: string;
  id: string;
  name: string;
};

type NetworkType = {
  id: string;
  name: string;
  providerInfos: Provider[];
};

type ConfigMetadata = {
  property: string;
  name: string;
  description: string;
  type: {
    name: string;
    id: string;
    type: string;
    expands?: Record<string, any>;
  };
  properties: ConfigProperty[];
  scopes: any[];
};
