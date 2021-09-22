import type { BaseItem, State } from '@/utils/typings';

type DeviceItem = {
  listeners: Record<string, any>[];
  networkConfiguration: Record<string, any>;
  networkType: string;
  runner: Record<string, any>;
  state: State;
} & BaseItem;
