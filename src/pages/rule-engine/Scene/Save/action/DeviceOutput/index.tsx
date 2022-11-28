import { Modal, Button, Steps } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { observer } from '@formily/react';
import Device from './device';
import Product from './product';
import Action from './actions';
import Service from './service';
import './index.less';
import DeviceModel from './model';
import { onlyMessage } from '@/utils/util';
import { ActionsDeviceProps } from '../../../typings';
import { FormModel } from '../..';

export const service = new Service<any>('');

interface Props {
  value: Partial<ActionsDeviceProps> | any;
  save: (data: any, _options?: any) => void;
  cancel: () => void;
  name: number;
}

export default observer((props: Props) => {
  const [open, setOpen] = useState<boolean>(true);
  // const [data, setData] = useState<any>({})
  const formRef = useRef<any>();

  DeviceModel.steps = [
    {
      key: 'product',
      title: '选择产品',
      content: <Product />,
    },
    {
      key: 'device',
      title: '选择设备',
      content: <Device name={props.name} />,
    },
    {
      key: 'action',
      title: '执行动作',
      content: (
        <Action
          name={props.name}
          get={(item: any) => {
            formRef.current = item;
          }}
        />
      ),
    },
  ];
  const next = () => {
    if (
      (DeviceModel.current === 0 && DeviceModel.productId.length !== 0) ||
      (DeviceModel.current === 1 && DeviceModel.deviceId.length !== 0)
    ) {
      return (DeviceModel.current += 1);
    } else {
      return DeviceModel.current === 0
        ? onlyMessage('请选择产品', 'error')
        : onlyMessage('请选择设备', 'error');
    }
  };

  const prev = () => {
    DeviceModel.current -= 1;
  };

  const save = async () => {
    const value = await formRef.current?.validateFields();
    const item = {
      selector: DeviceModel.selector,
      source: DeviceModel.source,
      selectorValues: DeviceModel.selectorValues,
      productId: DeviceModel.productId,
      message: value,
    };
    console.log(item, value);

    const _options: any = {
      name: '', //设备名称
      type: '', //类型
      properties: '', //属性功能
      selector: DeviceModel.selector, //选择器标识
      productName: DeviceModel.productDetail.name,
      relationName: DeviceModel.relationName,
      taglist: [],
    };
    _options.name = DeviceModel.deviceDetail.name;
    const _type = value.device.message.messageType;
    if (_type === 'INVOKE_FUNCTION') {
      _options.type = '执行';
      _options.properties = value.device.message.functionId;
    }
    if (_type === 'READ_PROPERTY') {
      _options.type = '读取';
      _options.properties = value.device.message.properties?.[0];
    }
    if (_type === 'WRITE_PROPERTY') {
      _options.type = '设置';
      _options.properties = Object.keys(value.device.message.properties)?.[0];
    }
    if (_options.selector === 'tag') {
      _options.taglist = DeviceModel.selectorValues?.[0]?.value.map((it: any) => ({
        name: it.column || it.name,
        type: it.type ? (it.type === 'and' ? '并且' : '或者') : '',
        value: it.value,
      }));
      // console.log(_options.taglist, 'taglist')
    }
    console.log(_options);
    // console.log('device', item);
    props.save(item);
    FormModel.actions[props.name].options = _options;
    DeviceModel.current = 0;
  };

  useEffect(() => {
    console.log(props.value);
  }, [props.value]);

  return (
    <Modal
      title={'执行动作'}
      open={open}
      width={800}
      onCancel={() => {
        setOpen(false);
      }}
      maskClosable={false}
      footer={
        <div className="steps-action">
          {DeviceModel.current === 0 && <Button onClick={() => {}}>取消</Button>}
          {DeviceModel.current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              上一步
            </Button>
          )}
          {DeviceModel.current < DeviceModel.steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              下一步
            </Button>
          )}
          {DeviceModel.current === DeviceModel.steps.length - 1 && (
            <Button
              type="primary"
              onClick={async () => {
                save();
              }}
            >
              确定
            </Button>
          )}
        </div>
      }
    >
      <div className="steps-steps">
        <Steps current={DeviceModel.current} items={DeviceModel.steps} />
      </div>
      <div className="steps-content">{DeviceModel.steps[DeviceModel.current]?.content}</div>
    </Modal>
  );
});
