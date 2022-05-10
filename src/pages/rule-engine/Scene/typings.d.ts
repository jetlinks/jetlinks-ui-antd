import type { State } from '@/utils/typings';

type Action = {
  executor: string;
  configuration: Record<string, unknown>;
};

type Trigger = {
  trigger: string;
  device: Record<string, unknown>;
};

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
  type?: string;
  shakeLimit?: any;
  operation?: any;
  device?: any;
  timer?: any;
};

type TermsType = {
  column?: string;
  value?: any;
  type?: string;
  termType?: string;
  options?: any[];
  terms?: any[];
};

type ActionsType = {
  executor?: string;
  notify?: any;
  delay?: {
    time?: number;
    unit?: string;
  };
  device?: any;
};

type FormModelType = {
  id?: string;
  name?: string;
  trigger?: TriggerType;
  terms?: TermsType;
  parallel?: boolean;
  actions?: ActionsType[];
  description?: string;
};
