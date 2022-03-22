import type { BaseItem, State } from '@/utils/typings';

type NetworkItem = {
  shareCluster: boolean;
  type: string;
  typeObject: {
    name: string;
    text: string;
    value: string;
  };
  state: State;
  createTime: number;
  creatorId: string;
  configuration: Record<string, any>;
  cluster: any[];
} & BaseItem;
