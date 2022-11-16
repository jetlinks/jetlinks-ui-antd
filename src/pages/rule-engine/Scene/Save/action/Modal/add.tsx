import { Modal, Form } from 'antd';
import ActionsType from '@/pages/rule-engine/Scene/Save/components/TriggerWay/actionsType';

export default () => {
  const [form] = Form.useForm();

  return (
    <Modal title="类型">
      <Form form={form}>
        <Form.Item
          name="type"
          label="类型"
          required
          rules={[{ required: true, message: '请选择类型' }]}
        >
          <ActionsType />
        </Form.Item>
      </Form>
    </Modal>
  );
};
