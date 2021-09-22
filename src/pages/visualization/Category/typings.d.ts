import type { BaseItem } from '@/utils/typings';

type CategoryItem = {
  level: number;
  parentId: string;
  description: string;
  path: string;
  sortIndex: number;
  children: CategoryItem[];
} & BaseItem;
