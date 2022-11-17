import { Modal, Form } from 'antd';
import ActionsType from '@/pages/rule-engine/Scene/Save/components/TriggerWay/actionsType';
import { useState } from 'react';
import Notify from '../notify';
export default () => {
  const [form] = Form.useForm();
  const [actionType, setActionType] = useState<string>('');

  const actionTypeComponent = (type: string) => {
    switch (type) {
      case 'notify':
        return <Notify />;
      default:
        return null;
    }
  };

  return (
    <Modal
      title="类型"
      open
      width={800}
      onCancel={() => {}}
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
          <ActionsType />
        </Form.Item>
      </Form>
      {actionTypeComponent(actionType)}
    </Modal>
  );
};
