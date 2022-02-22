// 用户数据模型
import { model } from '@formily/reactive';

type ProductCategoryModelType = {
  bind: boolean;
  bindKeys: string[];
  unBindKeys: string[];
};

const ProductCategoryModel = model<ProductCategoryModelType>({
  bind: false,
  bindKeys: [],
  unBindKeys: [],
});

export default ProductCategoryModel;
