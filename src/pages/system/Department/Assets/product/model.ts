// 用户数据模型
import { model } from '@formily/reactive';

type ModelType = {
  bind: boolean;
  bindKeys: string[];
  unBindKeys: string[];
};

const Models = model<ModelType>({
  bind: false,
  bindKeys: [],
  unBindKeys: [],
});

export default Models;
