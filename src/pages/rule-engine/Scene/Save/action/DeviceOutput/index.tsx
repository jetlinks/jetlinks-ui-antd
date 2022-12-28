import { Modal, Button, Steps } from 'antd';
import { useEffect, useRef } from 'react';
import { observer } from '@formily/react';
import Device from './device';
import Product from './product';
import Action from './actions';
import Service from './service';
import './index.less';
import DeviceModel from './model';
import { onlyMessage } from '@/utils/util';
import { ActionsDeviceProps } from '../../../typings';
import { service as api } from '@/pages/device/Instance/index';
import { FormModel } from '../..';

export const service = new Service<any>('');

interface Props {
  value: Partial<ActionsDeviceProps> | any;
  save: (data: any, _options?: any) => void;
  cancel: () => void;
  name: number;
  thenName: number;
  branchGroup?: number;
  parallel: boolean;
}

export default observer((props: Props) => {
  const formRef = useRef<any>();
  const formProductIdRef = useRef<any>('');

  DeviceModel.steps = [
    {
      key: 'product',
      title: '选择产品',
      content: <Product productId={props.value?.productId} />,
    },
    {
      key: 'device',
      title: '选择设备',
      content: (
        <Device
          name={props.name}
          parallel={props.parallel}
          branchGroup={props.branchGroup}
          thenName={props.thenName}
          formProductId={formProductIdRef.current}
        />
      ),
    },
    {
      key: 'action',
      title: '执行动作',
      content: (
        <Action
          name={props.name}
          branchGroup={props.branchGroup}
          thenName={props.thenName}
          get={(item: any) => {
            formRef.current = item;
          }}
        />
      ),
    },
  ];
  const next = () => {
    if (
      (DeviceModel.current === 0 && DeviceModel.productId) ||
      (DeviceModel.current === 1 && DeviceModel.deviceId)
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

  const init = () => {
    DeviceModel.selector = 'fixed';
    DeviceModel.source = 'fixed';
    DeviceModel.selectorValues = [];
    DeviceModel.productId = '';
    DeviceModel.message = {};
    DeviceModel.current = 0;
  };

  const save = async () => {
    const value = await formRef.current?.validateFields();

    const item = {
      selector: DeviceModel.selector,
      source: DeviceModel.source,
      selectorValues: DeviceModel.selectorValues,
      productId: DeviceModel.productId,
      message: value.message,
    };
    // console.log(item, value);

    const _options: any = {
      name: '-', //设备名称
      type: '', //类型
      properties: '', //属性功能
      propertiesValue: '', //设置功能
      selector: DeviceModel.selector, //选择器标识
      productName: DeviceModel.productDetail.name,
      relationName: DeviceModel.relationName,
      taglist: [],
      columns: [],
      otherColumns: [],
    };
    _options.name = DeviceModel.deviceDetail?.name;
    const _type = value.message.messageType;
    if (_type === 'INVOKE_FUNCTION') {
      _options.type = '执行';
      _options.properties = DeviceModel.propertiesName;
    }
    if (_type === 'READ_PROPERTY') {
      _options.type = '读取';
      _options.properties = DeviceModel.propertiesName;
    }
    if (_type === 'WRITE_PROPERTY') {
      _options.type = '设置';
      _options.properties = DeviceModel.propertiesName;
      _options.propertiesValue = DeviceModel.propertiesValue;
      _options.columns = DeviceModel.columns;
      _options.otherColumns = DeviceModel.columns;
      const cur: any = Object.values(value.message.properties)?.[0];
      if (cur?.source === 'upper') {
        _options.propertiesValue = DeviceModel.actionName;
      }
    }
    if (_options.selector === 'tag') {
      _options.taglist = DeviceModel.selectorValues?.[0]?.value.map((it: any) => ({
        name: it.column || it.name,
        type: it.type ? (it.type === 'and' ? '并且' : '或者') : '',
        value: it.value,
      }));
      // console.log(_options.taglist, 'taglist')
    }
    // console.log(DeviceModel.propertiesValue, _options);
    props.save(item, _options);
    init();
  };

  useEffect(() => {
    // console.log(props.value);
    if (props.value) {
      DeviceModel.selector = props.value.selector;
      DeviceModel.productId = props.value.productId;
      DeviceModel.selector = props.value.selector;
      DeviceModel.selectorValues = props.value.selectorValues;
      DeviceModel.message = props.value.message;
      DeviceModel.deviceId =
        props.value.selector === 'fixed'
          ? props.value.selectorValues?.map((item: any) => item.value)[0]
          : 'deviceId';
    }
    return () => {
      init();
    };
  }, [props.value]);

  useEffect(() => {
    const item = FormModel.current?.branches?.[0].then?.[0]?.actions?.[0].device?.productId;
    console.log(item);
    formProductIdRef.current = item;
  }, []);

  return (
    <Modal
      title={'执行动作'}
      open
      width={810}
      onCancel={() => {
        props.cancel();
        DeviceModel.current = 0;
      }}
      maskClosable={false}
      footer={
        <div className="steps-action">
          {DeviceModel.current === 0 && (
            <Button
              onClick={() => {
                props.cancel();
                DeviceModel.current = 0;
              }}
            >
              取消
            </Button>
          )}
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
        <Steps
          current={DeviceModel.current}
          items={DeviceModel.steps}
          onChange={(value) => {
            console.log(value);
            if (value === 1) {
              return DeviceModel.productId
                ? (DeviceModel.current = 1)
                : onlyMessage('请选择产品', 'error');
            } else if (value === 2) {
              if (DeviceModel.deviceId) {
                api.detail(DeviceModel.deviceId).then((res) => {
                  if (res.status === 200) {
                    DeviceModel.deviceDetail = res.result || {};
                  }
                });
              }
              return DeviceModel.deviceId
                ? (DeviceModel.current = 2)
                : onlyMessage('请选择设备', 'error');
            } else {
              return (DeviceModel.current = 0);
            }
          }}
        />
      </div>
      <div className="steps-content">{DeviceModel.steps[DeviceModel.current]?.content}</div>
    </Modal>
  );
});
