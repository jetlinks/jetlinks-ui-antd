import { Modal, Button, Steps } from 'antd';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import { useEffect } from 'react';
import { onlyMessage } from '@/utils/util';
import type { TriggerDevice } from '@/pages/rule-engine/Scene/typings';
import Product from './product';
import Device from './device';

interface AddProps {
  value?: any;
  onCancel?: () => void;
  onSave?: (data: any) => void;
}

interface DeviceModelProps extends Partial<TriggerDevice> {
  steps: { key: string; title: string }[];
  stepNumber: number;
  productId: string;
  productDetail: any;
  deviceId: string;
  orgId: string;
}

export const DeviceModel = model<DeviceModelProps>({
  steps: [
    {
      key: 'product',
      title: '选择产品',
    },
    {
      key: 'device',
      title: '选择设备',
    },
    {
      key: 'type',
      title: '触发类型',
    },
  ],
  stepNumber: 0,
  productId: '',
  productDetail: {},
  deviceId: '',
  orgId: '',
  selector: 'custom',
});

export default observer((props: AddProps) => {
  const prev = () => {
    DeviceModel.stepNumber -= 1;
  };

  const next = async () => {
    if (DeviceModel.stepNumber === 0) {
      if (DeviceModel.productId) {
        DeviceModel.stepNumber = 1;
      } else {
        onlyMessage('请选择产品', 'error');
      }
    } else if (DeviceModel.stepNumber === 1) {
      if (DeviceModel.selector === 'custom' && !DeviceModel.selectorValues?.length) {
        onlyMessage('请选择设备', 'error');
        return;
      } else if (DeviceModel.selector && !DeviceModel.selectorValues?.length) {
        onlyMessage('请选择部门', 'error');
        return;
      }
      DeviceModel.stepNumber = 2;
    } else if (DeviceModel.stepNumber === 2) {
    }
  };

  const renderComponent = (type: string) => {
    switch (type) {
      case 'device':
        return <Device />;
      case 'type':
        return;
      default:
        return <Product />;
    }
  };

  useEffect(() => {
    if (props.value) {
      // TODO 处理回显数据
    }
  }, [props.value]);

  return (
    <Modal
      visible
      title="执行规则"
      width={800}
      onCancel={() => {
        props.onCancel?.();
        DeviceModel.stepNumber = 0;
      }}
      footer={
        <div className="steps-action">
          {DeviceModel.stepNumber === 0 && (
            <Button
              onClick={() => {
                props.onCancel?.();
                DeviceModel.stepNumber = 0;
              }}
            >
              取消
            </Button>
          )}
          {DeviceModel.stepNumber > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              上一步
            </Button>
          )}
          {DeviceModel.stepNumber < DeviceModel.steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => {
                next();
              }}
            >
              下一步
            </Button>
          )}
          {DeviceModel.stepNumber === DeviceModel.steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => {
                next();
              }}
            >
              确定
            </Button>
          )}
        </div>
      }
    >
      <div className="steps-steps">
        <Steps current={DeviceModel.stepNumber} items={DeviceModel.steps} />
      </div>
      <div className="steps-content">
        {renderComponent(DeviceModel.steps[DeviceModel.stepNumber]?.key)}
      </div>
    </Modal>
  );
});
