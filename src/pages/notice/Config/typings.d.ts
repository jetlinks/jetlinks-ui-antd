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
