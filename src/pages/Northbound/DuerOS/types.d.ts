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
  applianceType: string;
  actionMappings: ActionMapping[];
  propertyMappings: PropertyMapping[];
} & BaseItem;
