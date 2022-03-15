import type {
  DeviceMetadata,
  MetadataItem,
  MetadataType,
  ProductItem,
} from '@/pages/device/Product/typings';
import type { DeviceInstance } from '@/pages/device/Instance/typings';

/**
 *
 * @param type 物模型类型 events
 * @param item 物模型数据 【{a},{b},{c}】
 // * @param target product、device
 * @param data product 、device [{event:[1,2,3]]
 * @param onEvent 数据更新回调：更新数据库、发送事件等操作
 *
 */
export const updateMetadata = (
  type: MetadataType,
  item: MetadataItem[],
  // target: 'product' | 'device',
  data: ProductItem | DeviceInstance,
  onEvent?: (type: 'update' | 'add', item: MetadataItem) => void,
): ProductItem | DeviceInstance => {
  const metadata = JSON.parse(data.metadata || '{}') as DeviceMetadata;
  const config = (metadata[type] || []) as MetadataItem[];
  if (item.length > 1) {
    item.forEach((i) => {
      const index = config.findIndex((c) => c.id === i.id);
      if (index > -1) {
        config[index] = i;
        onEvent?.('update', i);
      } else {
        config.push(i);
        onEvent?.('add', i);
      }
    });
  }
  // @ts-ignore
  metadata[type] = config;
  data.metadata = JSON.stringify(metadata);
  return data;
};
