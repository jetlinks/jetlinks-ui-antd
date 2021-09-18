import type { BaseItem, State } from '@/utils/typings';

type CtwingItem = {
  apiAddress: string;
  appKey: string;
  appSecret: string;
  masterKey: string;
  state: State;
} & BaseItem;
