import { BaseItem } from '@/utils/typings';

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
  state?: {
    text: string;
    value: string | number;
  };
  productName?: string;
  applianceType: {
    text: string;
    value: string;
  };
  actionMappings: ActionMapping[];
  propertyMappings: PropertyMapping[];
} & BaseItem;
