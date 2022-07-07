import type { BaseItem, State } from '@/utils/typings';

type DeviceType = {
  text: string;
  value: string;
};

export type ProductItem = {
  id: string;
  name: string;
  classifiedId: string | string[];
  classifiedName: string;
  configuration: Record<string, any>;
  createTime: number;
  updateTime: number;
  creatorId: string;
  deviceType: DeviceType;
  deviceTypeId?: string;
  count?: number;
  messageProtocol: string;
  metadata: string;
  orgId: string;
  protocolName: string;
  state: number;
  transportProtocol: string;
  describe?: string;
  accessId?: string;
  accessName?: string;
  photoUrl?: string;
  storePolicy?: string;
  accessProvider?: string;
};

export type ConfigProperty = {
  property: string;
  name: string;
  description: string;
  type: {
    name: string;
    id: string;
    type: string;
    elements?: any[];
  };
  scopes: any[];
};

export type ConfigMetadata = {
  name: string;
  description: string;
  scopes: any[];
  properties: ConfigProperty[];
};

export type MetadataType = 'events' | 'functions' | 'properties' | 'tags';

export type DeviceMetadata = {
  events: Partial<EventMetadata>[];
  properties: Partial<PropertyMetadata>[];
  functions: Partial<FunctionMetadata>[];
  tags: Partial<TagMetadata>[];
};
export type MetadataItem = Partial<EventMetadata | PropertyMetadata | FunctionMetadata> &
  Record<string, any>;

type EventMetadata = {
  id: string;
  name: string;
  expands?: {
    eventType?: string;
    level?: string;
  } & Record<string, any>;
  valueType: {
    type: string;
    properties: {
      id: string;
      name: string;
      dataType: string;
      valueType: {
        type: string;
      } & Record<any, any>;
    }[];
  };
  description: string;
};
type FunctionMetadata = {
  id: string;
  name: string;
  async: boolean;
  output: Record<string, unknown>;
  inputs: ({
    id: string;
    name: string;
    valueType: {
      type: string;
    } & Record<any, any>;
  } & Record<string, any>)[];
};
type PropertyMetadata = {
  id: string;
  name: string;
  dataType?: string;
  valueType: {
    type: string;
  } & Record<any, any>;
  expands: Record<string, any>;
  description?: string;
  // 运行状态处需要数据
  list?: Record<string, unknown>[];
};
type TagMetadata = {
  id: string;
  name: string;
  valueType: {
    type: string;
  } & Record<string, any>;
  expands: Record<string, any>;
};

type AlarmRule = {
  actions: {
    configuration: Record<string, unknown>;
    executor: string;
  }[];
  productId: string;
  productName: string;
  properties: Record<string, unknown>[];
  shakeLimit: Record<string, unknown>;
  triggers: Record<string, unknown>[];
} & BaseItem;

type AlarmSetting = {
  state: State;
  createTime: number;
  target: string;
  targetId: string;
  alarmRule: AlarmRule[];
} & BaseItem;

type AlarmRecord = {
  id: string;
  alarmId: string;
  alarmName: string;
  alarmTime: number;
  description: string;
  deviceId: string;
  deviceName: string;
  productId: string;
  productName: string;
  state: string;
  updateTime: number;
  alarmData: {
    alarmId: string;
    alarmName: string;
    deviceId: string;
    deviceName: string;
    id: string;
    productId: string;
    productName: string;
    timestamp: number;
  } & Record<string, unknown>;
};

type UnitType = {
  id: string;
  name: string;
  description: string;
  symbol: string;
  text: string;
  type: string;
  value: string;
};

type ObserverMetadata = {
  type: unknown[];
  subscribe: (data: any) => void;
  next: (data: any) => void;
};
