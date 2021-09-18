import type { BaseItem } from '@/utils/typings';

type Action = {
  arg: unknown[];
} & BaseItem;

type Mode = BaseItem;

type Property = BaseItem;

type DuerOSItem = {
  actions: Action[];
  modes: Mode[];
  properties: Property[];
} & BaseItem;
