import type { BaseItem, State } from '@/utils/typings';

type DeviceItem = {
  productId: string;
  productName: string;
  registryTime: number;
  state: State;
  createTime: number;
  creatorId: string;
  creatorName: string;
  deviceMetadata: string;
  features: unknown[];
  configuration: Record<string, any>;
} & BaseItem;
