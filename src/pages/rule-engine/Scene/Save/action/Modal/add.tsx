import { Modal, Form } from 'antd';
import ActionsTypeComponent from '@/pages/rule-engine/Scene/Save/components/TriggerWay/actionsType';
import { useEffect, useState } from 'react';
import Notify from '../notify';
import type { ActionsType } from '@/pages/rule-engine/Scene/typings';

interface Props {
  close: () => void;
  data: Partial<ActionsType>;
  name: number;
}
import Device from '../DeviceOutput';
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
        return <Device />;
      case 'notify':
        return (
          <Notify
            value={props.data?.notify || {}}
            save={(data: any) => {
              console.log(data); // value
              setActionType('');
              props.close();
            }}
            name={props.name}
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
      }}
    >
      <Form form={form} layout={'vertical'}>
        <Form.Item
          name="type"
          label="类型"
          required
          rules={[{ required: true, message: '请选择类型' }]}
        >
          <ActionsTypeComponent />
        </Form.Item>
      </Form>
      {actionTypeComponent(actionType)}
    </Modal>
  );
};
