import React from 'react';
import { Form, Input, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import api from '@/services';

interface Props extends FormComponentProps {
  data: {
    type: string;
    description: string;
    key: string;
    id: string;
    name: string;
    parentId: string;
  };
  close: Function;
  save: Function;
}

const Save = (props: Props) => {
  const {
    form,
    form: { getFieldDecorator },
  } = props;

  const save = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      let parentId = props.data.parentId;
      if (fileValue.id === '') fileValue.id = undefined;
      api.productCategoty.save({ ...fileValue, parentId }).then(res => {
        if (res.status === 200) {
          props.save();
        }
      });
    });
  };
  return (
    <Modal
      visible
      title={`${props.data.type}分类`}
      onCancel={() => props.close()}
      onOk={() => {
        save();
      }}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item key="id" label="分类ID">
          {getFieldDecorator('id', {
            rules: [{ message: '请输入分类ID' }],
          })(<Input placeholder="请输入分类ID" />)}
        </Form.Item>
        <Form.Item key="key" label="分类标识">
          {getFieldDecorator('key', {
            rules: [{ required: true, message: '请输入分类标识' }],
          })(<Input placeholder="请输入分类标识" />)}
        </Form.Item>
        <Form.Item key="name" label="分类名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入分类名称' }],
          })(<Input placeholder="请输入分类名称" />)}
        </Form.Item>
        <Form.Item key="description" label="描述">
          {getFieldDecorator('description', {
            rules: [{ required: false, message: '请输入描述' }],
          })(<Input placeholder="请输入描述" />)}
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default Form.create<Props>()(Save);
