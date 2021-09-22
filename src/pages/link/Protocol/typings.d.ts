import type { BaseItem } from '@/utils/typings';

type ProtocolItem = {
  state: number;
  type: string;
  configuration: Record<string, any>;
} & BaseItem;
