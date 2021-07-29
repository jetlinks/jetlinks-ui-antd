export type CommandItem = {
  id: string;
  deviceId: string;
  deviceName: string;
  lastError: string;
  lastErrorCode: string;
  maxRetryTimes: number;
  messageId: string;
  messageType: string;
  productId: string;
  replyTimestamp: number;
  retryTimes: number;
  sendTimestamp: number;
  serverId: string;
  state: {
    text: string;
    value: string;
  };
  downstream: {
    deviceId: string;
    functionId: string;
    headers: Record<string, any>;
    inputs: Record<string, any>[];
    messageId: string;
    messageType: string;
    timestamp: number;
  };
};
