import { observer } from '@formily/react';
import { productModel } from '@/pages/device/Product';

const BaseInfo = observer(() => {
  return (
    <div>
      基础信息
      {JSON.stringify(productModel.current)}
    </div>
  );
});
export default BaseInfo;
