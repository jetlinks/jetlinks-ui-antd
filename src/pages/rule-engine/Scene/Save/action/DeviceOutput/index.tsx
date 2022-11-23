import { Modal, Button, Steps } from 'antd';
import { useRef, useState } from 'react';
import { observer } from '@formily/react';
import Device from './device';
import Product from './product';
import Action from './actions';
import Service from './service';
// import { model } from '@formily/reactive';
import './index.less';
import DeviceModel from './model';
import { onlyMessage } from '@/utils/util';

export const service = new Service<any>('');

export default observer(() => {
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
      content: <Device />,
    },
    {
      key: 'action',
      title: '执行动作',
      content: (
        <Action
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
    console.log(value);
  };

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
