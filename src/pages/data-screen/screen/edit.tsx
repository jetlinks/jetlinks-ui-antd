import React from "react";
import {Form, Input, Modal, TreeSelect} from "antd";
import {FormComponentProps} from "antd/es/form";
import api from '@/services'

const {TreeNode} = TreeSelect;

interface Props extends FormComponentProps {
  data?: any,
  close: Function,
  save: Function
}

const Save = (props: Props) => {
  const {form, form: {getFieldDecorator}} = props;

  const save = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      let param = {
        description: fileValue.description,
        name: fileValue.name,
        type: "big_screen",
        target: "",
        catalogId: fileValue.catalogId,
        state: {
          text: "启用",
          value: "enabled"
        },
      };
      api.screen.update(fileValue.id, param).then(res => {
        if (res.status === 200) {
          props.save()
          // window.open('http://localhost:8080/build/1296699307128270849','_blank')
        }
      })
    })
  };
  let getView = (view: any) => {
    if (view.children && view.children.length > 0) {
      return (
        <TreeNode title={view.name} value={view.id}>
          {
            view.children.map((v: any) => {
              return getView(v)
            })
          }
        </TreeNode>
      )
    }
  };
  return (
    <Modal
      visible
      title="编辑大屏"
      onCancel={() => props.close()}
      onOk={() => {
        save()
      }}
    >
      <Form labelCol={{span: 4}} wrapperCol={{span: 20}}>
        <Form.Item key="id" label="大屏ID">
          {getFieldDecorator('id', {
            rules: [{required: true, message: '请输入大屏ID'}],
            initialValue: props.data.id ? props.data.id : ''
          })(<Input placeholder="请输入大屏ID" readOnly={!!props.data.id}/>)}
        </Form.Item>
        <Form.Item key="name" label="大屏名称">
          {getFieldDecorator('name', {
            rules: [{required: true, message: '请输入大屏名称'}],
            initialValue: props.data.name ? props.data.name : ''
          })(<Input placeholder="请输入大屏名称"/>)}
        </Form.Item>
        <Form.Item key="description" label="说明">
          {getFieldDecorator('description', {
            rules: [{required: false, message: '请输入说明'}],
            initialValue: props.data.description ? props.data.description : ''
          })(<Input placeholder="请输入说明"/>)}
        </Form.Item>
      </Form>
    </Modal>
  )
};
export default Form.create<Props>()(Save);
