export class FlowCard {
  id: string;

  iccId: string;

  deviceId: string;

  platformConfigId: string;

  operatorPlatformType: string;

  operatorName: string;

  batchNumber: string;

  cardType: string;

  totalFlow: number;
  usedFlow: number;
  residualFlow: number;

  cardState: {
    state: string;
    sign: string;
    text: string;
  };

  reminderSwitch: boolean;

  activationDate: integer;

  expiryDate: integer;

  updateTime: integer;

  creatorId: string;

  createTime: string;

  creatorName: string;
}

export interface FlowCardInstancePagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface DeviceInstanceListData {
  list: FlowCard[];
  pagination: Partial<FlowCardInstancePagination>;
}
