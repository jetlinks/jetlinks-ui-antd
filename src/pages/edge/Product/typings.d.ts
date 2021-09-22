import type { BaseItem } from '@/utils/typings';

type ProductItem = {
  createTime: number;
  description: string;
  model: string;
  version: string;
  manufacturer: string;
} & BaseItem;
