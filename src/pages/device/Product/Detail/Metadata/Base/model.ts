import { model } from '@formily/reactive';
import type { MetadataItem } from '@/pages/device/Product/typings';

type MetadataModelType = {
  item: MetadataItem;
  edit: boolean;
  type: 'events' | 'function' | 'property' | 'tag';
};
const MetadataModel = model<MetadataModelType>({
  item: {},
  edit: false,
  type: 'events',
});
export default MetadataModel;
