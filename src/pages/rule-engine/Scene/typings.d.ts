import type { State } from '@/utils/typings';

type Action = {
  executor: string;
  configuration: Record<string, unknown>;
};

type Trigger = {
  trigger: string;
  device: Record<string, unknown>;
};

export enum OperatorType {
  'online' = 'online',
  'offline' = 'offline',
  'reportEvent' = 'reportEvent',
  'reportProperty' = 'reportProperty',
  'readProperty' = 'readProperty',
  'writeProperty' = 'writeProperty',
  'invokeFunction' = 'invokeFunction',
}

export enum TimerTrigger {
  'week' = 'week',
  'month' = 'month',
  'cron' = 'cron',
}

export enum TimeUnit {
  'seconds' = 'seconds',
  'minutes' = 'minutes',
  'hours' = 'hours',
}

export enum Executor {
  'notify' = 'notify',
  'delay' = 'delay',
  'device' = 'device',
  'alarm' = 'alarm',
}

export interface OperationTimerPeriod {
  from: string;
  to: string;
  every: string[];
  unit: keyof typeof TimeUnit;
}

export interface OperationTimer {
  trigger: keyof typeof TimerTrigger;
  mod: string;
  cron?: string;
  when?: string[];
  period?: OperationTimerPeriod;
  once?: Record<string, any>;
}

export interface TriggerDeviceOptions {
  operator: keyof typeof OperatorType;
  /** 触发类型为readProperty,writeProperty,invokeFunction时不能为空 */
  timer?: OperationTimer;
  /** 触发类型为reportEvent时不能为空 */
  eventId?: string;
  /** 触发类型为readProperty时不能为空 */
  readProperties?: string[];
  /** 触发类型为writeProperty时不能为空 */
  writeProperties?: Record<string, any>;
  /** 触发类型为invokeFunction时不能为空 */
  functionId?: string;
  /** 触发类型为invokeFunction时不能为空 */
  functionParameters?: Record<string, any>[];
}

/**
 * 设备触发配置
 */
export interface TriggerDevice {
  productId: string;
  selector: string;
  selectorValues?: Record<string, any>[];
  operation?: TriggerDeviceOptions;
}

export interface ShakeLimitType {
  enabled: boolean;
  groupType: string;
  time: number;
  threshold: number;
  alarmFirst: boolean;
}

interface SceneItem {
  parallel: boolean;
  state: State;
  actions: Action[];
  triggers: Trigger[];
  id: string;
  name: string;
  description: string;
  triggerType: string;
}

type TriggerType = {
  type: string;
  /**
   * 防抖配置
   */
  shakeLimit?: any;
  /**
   * 拓展信息
   */
  options?: ShakeLimitType;
  /**
   * 设备触发配置
   */
  device?: TriggerDevice;
  /**
   * 定时触发配置
   */
  timer?: any;
};

interface TermsVale {
  source: string | 'manual' | 'metric';
  /** 手动输入值,source为 manual 时不能为空 */
  value?: Record<string, any>;
  /** 指标值,source为 metric 时不能为空 */
  metric?: Record<string, any>;
}

type TermsType = {
  column?: string;
  value?: any;
  type?: string;
  termType?: string;
  options?: any[];
  terms?: any[];
};

type Relation = {
  objectType: string;
  objectId: string;
};

type NotifyVariablesType = {
  source: string;
  value?: Record<string, any>;
  upperKey?: string;
  relation?: Relation;
  options?: any;
};

interface NotifyProps {
  notifyType: string;
  notifierId: string;
  templateId: string;
  variables: Record<string, NotifyVariablesType>;
}

type ActionsType = {
  executor: keyof typeof Executor;
  /** 执行器类型为notify时不能为空 */
  notify?: NotifyProps;
  /** 执行器类型为delay时不能为空 */
  delay?: {
    time?: number;
    unit?: keyof typeof TimeUnit;
  };
  device?: any;
  alarm?: any;
  terms?: TermsType[];
};

type FormModelType = {
  id?: string;
  name?: string;
  /**
   * 触发方式
   */
  trigger?: TriggerType;
  /**
   * 触发条件,结构与通用查询条件相同。条件数据来自接口：根据触发器解析出支持的条件列
   */
  terms?: TermsType[];
  /**
   * 执行动作
   */
  actions?: ActionsType[];
  /**
   * 动作分支
   */
  branches?: any[];
  /**
   * 拓展信息,用于前端存储一些渲染数据
   */
  options?: any;
  description?: string;
};
