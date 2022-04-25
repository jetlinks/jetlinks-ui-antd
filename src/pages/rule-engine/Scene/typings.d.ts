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
  describe: string;
}
