import type { BaseItem } from '@/utils/typings';

type AccessItem = {
  id: string | undefined;
  name: string;
  description: string;
  provider: string;
  protocol: string;
  transport: string;
  channel: string;
  channelId: string;
  state: {
    text: string;
    value: string;
  };
  channelInfo: Record<string, any>;
  protocolDetail: Record<string, any>;
  transportDetail: Record<string, any>;
} & BaseItem;
