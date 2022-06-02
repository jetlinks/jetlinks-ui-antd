import type { BaseItem, State } from '@/utils/typings';

export type DeviceItem = {
  photoUrl?: string;
  channelNumber: number;
  createTime: number;
  firmware: string;
  gatewayId: string;
  host: string;
  manufacturer: string;
  model: string;
  port: number;
  provider: string;
  state: State;
  streamMode: string;
  transport: string;
} & BaseItem;
