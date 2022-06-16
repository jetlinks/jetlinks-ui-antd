import { Button, Card, Tabs } from 'antd';
import { InstanceModel } from '@/pages/device/Instance';
import type { FunctionMetadata } from '@/pages/device/Product/typings';
import FnForm from './form';
import AModel from './AdvancedMode';
import { Empty, PermissionButton } from '@/components';
import { useDomFullHeight } from '@/hooks';
import { getMenuPathByParams } from '@/utils/menu';
import useHistory from '@/hooks/route/useHistory';

const Functions = () => {
  const functionList = JSON.parse(InstanceModel.detail.metadata || '{}')
    .functions as FunctionMetadata[];
  const history = useHistory();

  const { minHeight } = useDomFullHeight(`.device-detail-function`);
  const { permission } = PermissionButton.usePermission('device/Product');

  const empty = () => {
    const isIndependent = InstanceModel.detail?.independentMetadata;
    const path = isIndependent
      ? getMenuPathByParams('device/Product/Detail', InstanceModel.detail?.productId)
      : getMenuPathByParams('device/Instance/Detail', InstanceModel.detail?.id);

    let description = <></>;
    if (isIndependent) {
      // 物模型解绑
      if (!permission.update) {
        description = <span>请联系管理员配置物模型属性</span>;
      } else {
        description = (
          <span>
            暂无数据, 请前往产品配置
            <Button
              style={{ margin: '0 6px' }}
              type={'link'}
              onClick={() => {
                history.push(`${path}?key=metadata`);
              }}
            >
              物模型-功能定义
            </Button>
          </span>
        );
      }
    } else {
      description = (
        <span>
          暂无数据，请配置
          <Button
            style={{ margin: '0 6px' }}
            type={'link'}
            onClick={() => {
              history.push(`${path}?key=metadata`);
            }}
          >
            物模型-功能定义
          </Button>
        </span>
      );
    }

    return <Empty description={description} />;
  };

  return (
    <Card className={'device-detail-function'} style={{ minHeight: minHeight }}>
      {functionList ? (
        <Tabs>
          <Tabs.TabPane tab={'精简模式'} key={1}>
            <Tabs tabPosition="left">
              {functionList &&
                functionList.map((fn) => {
                  return (
                    <Tabs.TabPane tab={fn.name} key={fn.id}>
                      <FnForm data={fn} />
                    </Tabs.TabPane>
                  );
                })}
            </Tabs>
          </Tabs.TabPane>
          <Tabs.TabPane tab={'高级模式'} key={2}>
            <Tabs tabPosition="left">
              {functionList &&
                functionList.map((fn) => {
                  return (
                    <Tabs.TabPane tab={fn.name} key={fn.id}>
                      <AModel data={fn} />
                    </Tabs.TabPane>
                  );
                })}
            </Tabs>
          </Tabs.TabPane>
        </Tabs>
      ) : (
        <div style={{ height: minHeight - 150 }}>{empty()}</div>
      )}
    </Card>
  );
};
export default Functions;
