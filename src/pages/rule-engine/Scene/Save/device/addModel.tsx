import { Modal, Button, Steps } from 'antd';
import { observer } from '@formily/react';
import { model } from '@formily/reactive';
import { useEffect, useRef } from 'react';
import { onlyMessage } from '@/utils/util';
import type { TriggerDevice, TriggerDeviceOptions } from '@/pages/rule-engine/Scene/typings';
import Product from './product';
import Device from './device';
import Type from './type';
import { numberToString } from '../components/TimingTrigger/whenOption';
import { timeUnitEnum } from '../components/TimingTrigger';

interface AddProps {
  value?: TriggerDevice;
  onCancel?: () => void;
  onSave?: (data: TriggerDevice, options: any) => void;
}

interface DeviceModelProps extends Partial<TriggerDevice> {
  steps: { key: string; title: string }[];
  stepNumber: number;
  productId: string;
  productDetail: any;
  metadata: {
    properties?: any[];
    events?: any[];
    functions?: any[];
  };
  deviceId: string;
  orgId: string;
  operation: TriggerDeviceOptions;
  options: any;
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
  metadata: {},
  operation: {
    operator: 'online',
  },
  options: {},
});

export default observer((props: AddProps) => {
  const typeRef = useRef<{ validateFields?: any }>();

  useEffect(() => {
    DeviceModel.stepNumber = 0;
  }, []);

  useEffect(() => {
    Object.assign(DeviceModel, props.value);
  }, [props.value]);

  const prev = () => {
    DeviceModel.stepNumber -= 1;
  };

  const handleOptions = (data: TriggerDeviceOptions) => {
    // console.log(data);

    const _options: any = {
      name: '', // 名称
      onlyName: false,
      type: '', // 触发类型
      productName: '',
      time: undefined,
      when: undefined,
      extraTime: undefined,
      action: DeviceModel.options.action,
    };
    if (DeviceModel.selector === 'custom') {
      _options.name = DeviceModel.selectorValues?.map((item) => item.name).join(',');
    } else if (DeviceModel.selector === 'org') {
      _options.name = DeviceModel.selectorValues?.[0].name + '的';
      _options.productName = DeviceModel.productDetail.name; // 产品名称
    } else {
      _options.name = '所有的' + DeviceModel.productDetail.name;
    }

    if (data.timer) {
      const _timer = data.timer;
      _options.when =
        _timer.when!.length === 0
          ? '每天'
          : `每${_timer
              .when!.map((item) => {
                if (_timer!.trigger === 'week') {
                  return numberToString[item];
                } else {
                  return item + '号';
                }
              })
              .join(',')}`;
      if (_timer.once) {
        _options.time = _timer.once;
      } else if (_timer.period) {
        _options.time = _timer.period.from + '-' + _timer.period.to;
        _options.extraTime = `每${_timer.period.every}${timeUnitEnum[_timer.period.unit]}执行1次`;
      }
    }

    if (data.operator === 'online') {
      _options.type = '上线';
      _options.action = '';
    }

    if (data.operator === 'offline') {
      _options.type = '离线';
      _options.action = '';
    }

    if (data.operator === 'reportProperty') {
      _options.type = '属性上报';
      _options.action = '';
    }
    return _options;
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
      } else if (DeviceModel.selector === 'org' && !DeviceModel.selectorValues?.length) {
        onlyMessage('请选择部门', 'error');
        return;
      }
      DeviceModel.stepNumber = 2;
    } else if (DeviceModel.stepNumber === 2) {
      // TODO 验证类型数据
      const operationData = await typeRef.current?.validateFields();
      if (operationData) {
        const _options = handleOptions(operationData);
        props.onSave?.(
          {
            operation: operationData,
            selectorValues: DeviceModel.selectorValues,
            selector: DeviceModel.selector!,
            productId: DeviceModel.productId,
          },
          _options,
        );
      }
    }
  };

  const renderComponent = (type: string) => {
    switch (type) {
      case 'device':
        return <Device />;
      case 'type':
        return <Type ref={typeRef} />;
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
