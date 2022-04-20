import type { BaseItem, State } from '@/utils/typings';

type Action = {
  executor: string;
  configuration: Record<string, unknown>;
};

type Trigger = {
  trigger: string;
  device: Record<string, unknown>;
};

type SceneItem = {
  parallel: boolean;
  state: State;
  actions: Action[];
  triggers: Trigger[];
} & BaseItem;
