import { InstanceModel } from '@/pages/device/Instance';
import { getMenuPathByParams } from '@/utils/menu';
import { Button } from 'antd';
import { Empty, PermissionButton } from '@/components';
import useHistory from '@/hooks/route/useHistory';

export default () => {
  const isIndependent = InstanceModel.detail?.independentMetadata;
  const path = getMenuPathByParams('device/Product/Detail', InstanceModel.detail?.productId);
  const { permission } = PermissionButton.usePermission('device/Product');
  const history = useHistory();

  let description = <></>;

  if (!isIndependent) {
    if (!permission.update) {
      description = <span>请联系管理员配置物模型属性</span>;
    } else {
      description = (
        <span>
          暂无数据, 请前往产品配置
          <Button
            style={{ margin: 0, padding: '0 4px' }}
            type={'link'}
            onClick={() => {
              history.push(`${path}?key=metadata`);
            }}
          >
            物模型
          </Button>
        </span>
      );
    }
  } else {
    // 物模型解绑
    description = (
      <span>
        暂无数据，请配置
        <Button
          style={{ margin: 0, padding: '0 4px' }}
          type={'link'}
          onClick={() => {
            InstanceModel.active = 'metadata';
            // history.push(`${path}?key=metadata`);
          }}
        >
          物模型
        </Button>
      </span>
    );
  }

  return <Empty description={description} />;
};
