// 用户数据模型
import { model } from '@formily/reactive';

type ModelType = {
  bind: boolean;
  bindUsers: { name: string; userId: string }[];
  unBindUsers: string[];
};

const Models = model<ModelType>({
  bind: false,
  bindUsers: [],
  unBindUsers: [],
});

export default Models;
