// 模型
import { ProductItem } from '@/pages/device/Product/typings';
import { model } from '@formily/reactive';

type ModelType = {
  steps: {
    key: string;
    title: string;
    content: React.ReactNode;
  }[];
  current: number;
  productId: string[];
  deviceId: string[];
  productDetail: ProductItem | any;
};

const DeviceModel = model<ModelType>({
  steps: [],
  current: 0,
  productId: [],
  deviceId: [],
  productDetail: {},
});

export default DeviceModel;
