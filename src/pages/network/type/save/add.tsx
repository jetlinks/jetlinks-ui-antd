import { Modal, Input, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import React, { useState } from 'react';

interface Props extends FormComponentProps {
  close: Function,
  save: Function
}
const Add: React.FC<Props> = props => {
  const [node, setNode] = useState('');
  const {
    form: { getFieldDecorator },
    form,
  } = props;

  const saveData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      props.save(node)
    });
  };
  
  return (
    <Modal
      title='新增'
      visible
      okText="确定"
      cancelText="取消"
      onOk={saveData}
      style={{ marginTop: '-3%' }}
      width="50%"
      onCancel={() => props.close()}
    >
      <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item label="serverId: " trigger={"onBlur"}>
            {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入serverId' }],
          })(<Input placeholder="请输入" onChange={(e) => {
            setNode(e.target.value)
          }} />)}
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default Form.create<Props>()(Add);
