type ModbusItem = {
  interval?: number;
  function: string;
  parameter: {
    address: string;
    quantity: number;
  };
  codec: {
    provider: string;
    configuration: {
      scaleFactor: number;
      readIndex: number;
    };
  };
};

type OpcuaItem = {
  interval?: number;
  nodeId: string;
};

type PointItem = {
  id?: string;
  name: string;
  description?: string;
  provider: string;
  collectorId: string;
  circuitBreaker: {
    type: 'Ignore' | 'Break' | 'LowerFrequency';
    maxConsecutiveErrors?: string;
  };
  features?: string[];
  accessModes: string[];
  configuration: ModbusItem | OpcuaItem;
  state?: {
    text: string;
    value: string;
  };
  runningState?: {
    text: string;
    value: string;
  };
};
type CollectorModbusItem = {
  unitId: number;
};

type CollectorOpcuaItem = {
  batchSize?: number;
};

type CollectorItem = {
  id: string;
  name: string;
  description?: string;
  provider: 'OPC_UA' | 'MODBUS_TCP';
  channelId: string;
  circuitBreaker: {
    type: 'Ignore' | 'Break' | 'LowerFrequency';
    maxConsecutiveErrors?: string;
  };
  configuration: any; // CollectorModbusItem | CollectorOpcuaItem;
  state: {
    text: string;
    value: string;
  };
  runningState: {
    text: string;
    value: string;
  };
  channelName?: string;
  channelId?: string;
};

type ChannelModbusItem = {
  port?: number;
  host?: string;
};

type ChannelOpcuaItem = {
  endpoint?: string;
  securityPolicy?: string;
  username?: string;
  password?: string;
};

type ChannelItem = {
  id: string;
  name: string;
  description?: string;
  provider: 'OPC_UA' | 'MODBUS_TCP';
  circuitBreaker: {
    type: 'Ignore' | 'Break' | 'LowerFrequency';
    maxConsecutiveErrors?: string;
  };
  configuration: any; //ChannelOpcuaItem | ChannelModbusItem;
  state: {
    text: string;
    value: string;
  };
  runningState: {
    text: string;
    value: string;
  };
};
