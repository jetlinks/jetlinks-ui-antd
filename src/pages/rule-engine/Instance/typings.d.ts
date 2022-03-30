import type { BaseItem } from '@/utils/typings';

type InstanceItem = {
  createTime: number;
  modelId: string;
  modelMeta: string;
  modelType: string;
  modelVersion: number;
  description?: string;
  state: {
    text: string;
    value: string;
  };
} & BaseItem;
