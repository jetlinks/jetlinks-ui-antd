import { Modal, Form, Input } from 'antd';
import React from 'react';
import { FormComponentProps } from 'antd/lib/form';

interface Props extends FormComponentProps {
  close: Function;
  save: Function;
  data: any;
  parentId: string | null;
}
interface State {}

const Save: React.FC<Props> = props => {
  const {
    form: { getFieldDecorator },
    form,
  } = props;
  const saveData = () => {
    const data = form.getFieldsValue();
    props.save({ parentId: props.parentId, typeId: 'org', ...data });
  };
  return (
    <Modal
      title={props.parentId ? `添加${props.parentId}子机构` : '添加机构'}
      visible
      onOk={() => saveData()}
      onCancel={() => props.close()}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item label="机构标识">
          {getFieldDecorator('id', {
            rules: [{ required: true }],
          })(<Input placeholder="机构标识" />)}
        </Form.Item>
        <Form.Item label="机构名称">
          {getFieldDecorator('name', {
            rules: [{ required: true }],
          })(<Input placeholder="机构名称" />)}
        </Form.Item>
        <Form.Item label="描述">
          {getFieldDecorator('description', {
            rules: [{ required: true }],
          })(<Input.TextArea placeholder="描述" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default Form.create<Props>()(Save);
