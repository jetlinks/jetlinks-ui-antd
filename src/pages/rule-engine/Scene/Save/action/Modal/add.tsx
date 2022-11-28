import { Modal, Form } from 'antd';
import ActionsTypeComponent from '@/pages/rule-engine/Scene/Save/components/TriggerWay/actionsType';
import { useEffect, useState } from 'react';
import Notify from '../notify';
import type { ActionsType, ParallelType } from '@/pages/rule-engine/Scene/typings';
import Device from '../DeviceOutput';
import Delay from '../Delay';

interface Props {
  close: () => void;
  save: (data: any, options?: any) => void;
  data: Partial<ActionsType>;
  name: number;
  type: ParallelType;
}

export default (props: Props) => {
  const [form] = Form.useForm();
  const [actionType, setActionType] = useState<string>('');

  useEffect(() => {
    if (props.data?.executor) {
      form.setFieldsValue({
        type: props.data.executor,
      });
    }
  }, [props.data]);

  const actionTypeComponent = (type: string) => {
    switch (type) {
      case 'device':
        return (
          <Device
            value={props.data?.device}
            save={(data: any, options: any) => {
              setActionType('');
              console.log('Device', data);
              // props.save(data, options);
              // console.log('device-------------', {
              //   type: 'device',
              //   key: props.data.key || `action_${props.name}`,
              //   device: {
              //     ...data,
              //   },
              // });
              props.save(
                {
                  type: 'device',
                  key: props.data.key || `device_${new Date().getTime()}`,
                  device: {
                    ...data,
                  },
                },
                options,
              );
            }}
            name={props.name}
            cancel={() => {
              setActionType('');
            }}
          />
        );
      case 'notify':
        return (
          <Notify
            value={props.data?.notify || {}}
            options={props.data?.options || {}}
            save={(data: any, option: any) => {
              setActionType('');
              props.save(
                {
                  ...data,
                  key: props.data.key || `notify_${new Date().getTime()}`,
                },
                option,
              );
            }}
            name={props.name}
            cancel={() => {
              setActionType('');
            }}
          />
        );
      case 'delay':
        return (
          <Delay
            value={props.data?.delay || {}}
            save={(data: any, options) => {
              setActionType('');
              props.save(
                {
                  type: 'delay',
                  key: props.data.key || `delay_${new Date().getTime()}`,
                  delay: {
                    ...data,
                  },
                },
                options,
              );
            }}
            cancel={() => {
              setActionType('');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title="类型"
      open
      width={800}
      onCancel={() => {
        props.close();
      }}
      onOk={async () => {
        const values = await form.validateFields();
        setActionType(values.type);
        if (values.type === 'relieve' || values.type === 'trigger') {
          props.save({ ...props.data, type: values.type });
        }
      }}
    >
      <Form form={form} layout={'vertical'}>
        <Form.Item
          name="type"
          label="类型"
          required
          rules={[{ required: true, message: '请选择类型' }]}
        >
          <ActionsTypeComponent type={props.type} />
        </Form.Item>
      </Form>
      {actionTypeComponent(actionType)}
    </Modal>
  );
};
