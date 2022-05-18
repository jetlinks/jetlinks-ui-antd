import type { BaseItem } from '@/utils/typings';

// type Action = {
//   arg: unknown[];
// } & BaseItem;
//
// type Mode = BaseItem;
//
// type Property = BaseItem;

// type DuerOSItem = {
//   actions?: Action[];
//   modes?: Mode[];
//   properties?: Property[];
// } & BaseItem;

type PropertyMapping = {
  source: string;
  target: string[];
};

type ActionMapping = {
  action: string;
  actionType: string;
  command: {
    message: Record<string, any>;
    messageType: string;
  };
};
type DuerOSItem = {
  version: number;
  manufacturerName: string;
  autoReportProperty: boolean;
  applianceType: {
    text: string;
    value: string;
  };
  actionMappings: ActionMapping[];
  propertyMappings: PropertyMapping[];
} & BaseItem;
