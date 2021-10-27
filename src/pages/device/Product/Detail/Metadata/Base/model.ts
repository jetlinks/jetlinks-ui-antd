import { model } from '@formily/reactive';
import type { MetadataItem } from '@/pages/device/Product/typings';

type MetadataModelType = {
  item: MetadataItem | unknown;
  edit: boolean;
  type: 'events' | 'function' | 'property' | 'tag';
  action: 'edit' | 'add';
};
const MetadataModel = model<MetadataModelType>({
  item: undefined,
  edit: false,
  type: 'events',
  action: 'add',
});
export default MetadataModel;
