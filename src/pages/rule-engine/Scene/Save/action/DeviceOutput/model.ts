// 模型
import { ProductItem } from '@/pages/device/Product/typings';
import { model } from '@formily/reactive';
import { ActionsDeviceProps } from '../../../typings';

type ModelType = {
  steps: {
    key: string;
    title: string;
    content: React.ReactNode;
  }[];
  current: number;
  productId: string[];
  deviceId: any[];
  productDetail: ProductItem | any;
  device: Partial<ActionsDeviceProps>;
  deviceDetail: any;
};

const DeviceModel = model<ModelType>({
  steps: [],
  current: 0,
  productId: [],
  deviceId: [],
  productDetail: {},
  device: {},
  deviceDetail: {},
});

export default DeviceModel;
