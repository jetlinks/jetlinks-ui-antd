import React from "react";
import { Form, Input, Modal } from "antd";
import { FormComponentProps } from "antd/es/form";
import api from '@/services'

interface Props extends FormComponentProps {
  data: {
    type: string,
    description: string,
    id: string,
    key:string,
    name: string,
    parentId: string
  },
  close: Function,
  edit: Function
}

const Edit = (props: Props) => {

  const { form, form: { getFieldDecorator } } = props;

  const edit = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      api.productCategoty.update({...fileValue}).then(res => {
        if(res.status === 200){
          props.edit()
        }
      })
    })
  };
  return (
    <Modal
      visible
      title={`${props.data.type}分类`}
      onCancel={() => props.close()}
      onOk={() => {
        edit()
      }}
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item key="id" label="分类ID">
          {getFieldDecorator('id', {
            rules: [{ message: '请输入分类ID' }],
            initialValue: props.data.id ? props.data.id : ''
          })(<Input placeholder="请输入分类ID" readOnly={!!props.data.id}/>)}
        </Form.Item>
        <Form.Item key="key" label="分类标识">
          {getFieldDecorator('key', {
            rules: [{ required: true, message: '分类标识' }],
            initialValue: props.data.key ? props.data.key : ''
          })(<Input placeholder="分类标识" readOnly={!!props.data.key}/>)}
        </Form.Item>
        <Form.Item key="name" label="分类名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入分类名称' }],
            initialValue: props.data.name ? props.data.name : ''
          })(<Input placeholder="请输入分类名称" />)}
        </Form.Item>
        <Form.Item key="description" label="描述">
          {getFieldDecorator('description', {
            rules: [{ required: false, message: '请输入描述' }],
            initialValue: props.data.description ? props.data.description : ''
          })(<Input placeholder="请输入描述" />)}
        </Form.Item>
      </Form>
    </Modal>
  )
};
export default Form.create<Props>()(Edit);
