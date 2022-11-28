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
  productId: string;
  deviceId: string;
  productDetail: ProductItem | any;
  device: Partial<ActionsDeviceProps>;
  deviceDetail: any;
  options: any;
  selector: string;
  selectorValues: any;
  upperKey: string;
  source: string;
  relationName: string;
};

const DeviceModel = model<ModelType>({
  steps: [],
  current: 0,
  productId: '',
  deviceId: '',
  productDetail: {},
  device: {},
  deviceDetail: {},
  options: {},
  selector: 'fixed',
  selectorValues: [],
  upperKey: '',
  source: 'fixed',
  relationName: '',
});

export default DeviceModel;
