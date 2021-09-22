import type { BaseItem, State } from '@/utils/typings';

type ScreenItem = {
  catalogId: string;
  metadata: string;
  state: State;
  target: string;
  type: string;
} & BaseItem;
