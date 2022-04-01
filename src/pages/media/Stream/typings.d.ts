import type { BaseItem } from '@/utils/typings';

type StreamItem = {
  description: string;
  provider: string;
  configuration: {
    secret?: string;
    apiHost: string;
    apiPort: number;
    rtpIp: string;
    rtpPort: number;
    dynamicRtpPort: boolean;
    dynamicRtpPortRange: number[];
  };
} & BaseItem;
