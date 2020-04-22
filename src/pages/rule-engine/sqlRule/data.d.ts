export interface RuleInstanceItem {
  createTime: number;
  description: string;
  id: string;
  modelId: string;
  modelMeta: string;
  modelType: string;
  modelVersion: number;
  name: string;
  state: any;
}

export interface SqlRule {
  id: string;
  name: string;
  type: string;
  cron: string;
  sql: string;
  actions: any[];
  whenErrorThen: any[];
}

export class AlarmAction {
  executor: string;
  configuration: any;
}
