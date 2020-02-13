import { Modal, Form, Select, Input } from 'antd';

import React from 'react';

interface Props {
  close: Function;
  data: any;
}
interface State {}
const Debug: React.FC<Props> = props => {
  const start = () => {
    //
  };
  return (
    <Modal
      visible
      title="调试通知模版"
      okText="发送"
      width={640}
      onOk={() => {
        start();
      }}
      onCancel={() => {
        props.close();
      }}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item label="通知配置">
          <Select></Select>
        </Form.Item>
        <Form.Item label="变量">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default Debug;
