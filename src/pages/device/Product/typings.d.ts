export type ProductItem = {
  id: string;
  name: string;
  classifiedId: string;
  classifiedName: string;
  configuration: Record<string, any>;
  createTime: number;
  creatorId: string;
  deviceType: {
    text: string;
    value: string;
  };
  count?: number;
  messageProtocol: string;
  metadata: string;
  orgId: string;
  protocolName: string;
  state: number;
  transportProtocol: string;
};
