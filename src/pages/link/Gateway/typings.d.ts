import type { BaseItem, State } from '@/utils/typings';

type GatewayItem = {
  networkId: string;
  provider: string;
  state: State;
  createTime: number;
  creatorId: string;
  configuration: Record<string, any>;
} & BaseItem;
