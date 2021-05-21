import React from "react";
import {Form, Input, message, Modal} from "antd";
import {FormComponentProps} from "antd/es/form";
import apis from "@/services";
import {RuleInstanceItem} from "@/pages/rule-engine/instance/data";

interface Props extends FormComponentProps {
  data?: Partial<RuleInstanceItem>
  close: Function
}

const Save = (props: Props) => {
  const {form, form: {getFieldDecorator}} = props;
  const save = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;

      if (props.data) {
        fileValue.modelType = props.data.modelType;
        fileValue.modelMeta = props.data.modelMeta;
      }
      apis.ruleInstance.create(fileValue).then(resp => {
        if (resp.status === 200) {
          message.success('保存成功');
          props.close();
          window.open(`/jetlinks/rule-editor/index.html#flow/${fileValue.id}`);
        }
      })
    })
  };
  return (
    <Modal
      visible
      title="新建规则实例"
      onCancel={() => props.close()}
      onOk={() => {
        save()
      }}
    >
      <Form labelCol={{span: 4}} wrapperCol={{span: 20}}>
        <Form.Item key="id" label="ID">
          {getFieldDecorator('id', {
            rules: [{required: true, message: '请输入实例ID'}],
          })(<Input placeholder="请输入实例ID"/>)}
        </Form.Item>
        <Form.Item key="name" label="名称">
          {getFieldDecorator('name', {
            rules: [{required: true, message: '请输入实例名称'}],
          })(<Input placeholder="请输入名称"/>)}
        </Form.Item>
        <Form.Item key="description" label="说明">
          {getFieldDecorator('description', {})(<Input.TextArea rows={3}/>)}
        </Form.Item>
      </Form>
    </Modal>
  )
};
export default Form.create<Props>()(Save);
