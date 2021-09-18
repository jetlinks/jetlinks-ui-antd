import type { BaseItem, State } from '@/utils/typings';

type OnenetItem = {
  aesKey: string;
  apiAddress: string;
  apiKey: string;
  description: string;
  state: State;
  validateToken: string;
} & BaseItem;
