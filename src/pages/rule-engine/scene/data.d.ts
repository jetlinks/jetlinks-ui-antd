export interface SceneItem {
    id: string;
    name: string;
    triggers: Array;
    parallel: Boolean;
    actions: Array;
}
export interface Triggers{
    name: string;
    trigger: string; //条件类型
    cron: string;
    device: any;
    scene: any;
}

export interface TriggersDevice{
    shakeLimit: any;
    productId: string;
    deviceId: string;
    type: string;
    modelId: string;
    filters: Array;
}

export class ActionData {
    executor: string;
    configuration?: any;
  }