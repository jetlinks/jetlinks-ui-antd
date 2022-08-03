import type {
  DeviceMetadata,
  MetadataItem,
  MetadataType,
  ProductItem,
} from '@/pages/device/Product/typings';
import type { DeviceInstance } from '@/pages/device/Instance/typings';
import { service } from '@/pages/device/components/Metadata/index';

/**
 * 更新物模型
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
  if (!data) return data;
  const metadata = JSON.parse(data.metadata || '{}') as DeviceMetadata;
  const config = (metadata[type] || []) as MetadataItem[];
  if (item.length > 0) {
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
  } else {
    console.warn('未触发物模型修改');
  }
  // @ts-ignore
  metadata[type] = config.sort((a, b) => b?.sortsIndex - a?.sortsIndex);
  data.metadata = JSON.stringify(metadata);
  return data;
};

/**
 * 删除物模型数据
 * @param type 物模型类型
 * @param item 删除的数据
 * @param data 设备/产品数据
 * @param onEvent 回调
 */
export const removeMetadata = (
  type: MetadataType,
  item: MetadataItem[],
  data: ProductItem | DeviceInstance,
  onEvent?: (type: 'remove', item: MetadataItem) => void,
): ProductItem | DeviceInstance => {
  const metadata = JSON.parse(data.metadata || '{}') as DeviceMetadata;
  const config = (metadata[type] || []) as MetadataItem[];
  // @ts-ignore
  metadata[type] = config.filter((i) => !item.map((r) => r.id).includes(i.id));
  onEvent?.('remove', item);
  data.metadata = JSON.stringify(metadata);
  return data;
};

/**
 * 保存物模型数据到服务器
 * @param type 类型
 * @param data 数据
 */
export const asyncUpdateMedata = (
  type: 'product' | 'device',
  data: ProductItem | DeviceInstance,
): Promise<any> => {
  switch (type) {
    case 'product':
      return service.saveProductMetadata(data);
    case 'device':
      return service.saveDeviceMetadata(data.id, JSON.parse(data.metadata || '{}'));
  }
};
