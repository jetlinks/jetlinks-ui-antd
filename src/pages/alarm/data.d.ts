import {SimpleType} from '@/utils/common';

export class alarm extends SimpleType {
  id: string;
  target: string;
  targetId: string;
  name: string;
  description: string;
  createTime: number;
  alarmRule: {
    productId?: string | undefined;
    name: string | undefined;
    deviceId?: string | undefined;
    deviceName?: string | undefined;
    productName?: string | undefined;
    actions: any[];
    triggers: any[];
    properties: any[];
    shakeLimit: {
      enabled: boolean; //是否开启
      time: number;  //时间
      threshold: number; // 次数阈值
      alarmFirst: boolean; //为true时 第一次，false时最后一次。
    }
  };
  state: {
    value: string,
    text: string,
  };
}

export class DeviceAlarmRule {
  id: string;
  name: string;
  productId: string;
  productName: string;
  deviceId: string;
  deviceName: string;
  triggers: AlarmTrigger[];
  properties: AlarmProperty[];
  actions: AlarmAction[];
}

export class AlarmTrigger {
  trigger: {
    value: string,
    text: string,
  };
  cron: string;
  type: {
    value: string,
    text: string,
  };
  parameters: AlarmParameters[];
  modelId: string;
  filters?: AlarmConditionFilter[];
}

export class AlarmConditionFilter {
  key: string;
  value: string;
  operator: {
    value: string,
    text: string,
  };
}

export class AlarmParameters {
  name: string;
  value: any;
}

export class AlarmProperty {
  property: string;
  alias: string;
}

export class AlarmAction {
  executor: string;
  configuration?: any;
}

export class AlarmLog {
  productId: string;
  productName: string;
  deviceId: string;
  deviceName: string;
  alarmId: string;
  alarmName: string;
  alarmTime: number;
  alarmData: any;
}

