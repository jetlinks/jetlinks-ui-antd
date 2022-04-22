import { Form, Input, Modal } from 'antd';

const SolveComponent = () => {
  return (
    <Modal title="告警处理" visible onOk={() => {}} onCancel={() => {}}>
      <Form name="basic" layout="vertical" onFinish={() => {}}>
        <Form.Item
          label="处理结果"
          name="username"
          rules={[{ required: true, message: '请输入处理结果!' }]}
        >
          <Input.TextArea rows={8} placeholder="请输入处理结果" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SolveComponent;
