import { Modal, Form, Input } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/lib/form';

interface Props extends FormComponentProps {
  close: Function;
  save: Function;
  data: any;
}

const Save: React.FC<Props> = props => {
  const {
    form: { getFieldDecorator },
    form,
    data,
  } = props;
  const saveData = () => {
    // const value = form.getFieldsValue();
    
    form.validateFields((err, fileValue) => {
      if (err) return;

      props.save({ typeId: 'role', ...fileValue });
    });
  };
  const formateTitle = () => {
    let title = '';
    if (props.data.id) {
      title += '编辑';
    } else {
      title += '添加';
    }

    title += '角色';
    return title;
  };

  return (
    <Modal title={formateTitle()} visible onOk={() => saveData()} onCancel={() => props.close()}>
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item label="角色标识">
          {getFieldDecorator('id', {
            rules: [{ required: true, message: '请输入角色标识' }],
            initialValue: data.id,
          })(<Input placeholder="角色标识" readOnly={!!data.id} />)}
        </Form.Item>
        <Form.Item label="角色名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入角色名称' }],
            initialValue: data.name,
          })(<Input placeholder="角色名称" />)}
        </Form.Item>
        <Form.Item label="描述">
          {getFieldDecorator('describe', {
            initialValue: data.describe,
          })(<Input.TextArea placeholder="描述" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default Form.create<Props>()(Save);
