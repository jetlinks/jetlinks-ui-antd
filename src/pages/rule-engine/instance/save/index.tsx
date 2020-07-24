import React from "react";
import { Modal, message, Form, Input } from "antd";
import { FormComponentProps } from "antd/es/form";
import apis from "@/services";

interface Props extends FormComponentProps {
    close: Function
    save: Function
}
const Save = (props: Props) => {
    const { form, form: { getFieldDecorator } } = props;
    const save = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;
            apis.ruleInstance.create(fileValue).then(resp => {
                if (resp.status === 200) {
                    message.success('保存成功');
                    props.close();
                    window.open(`/jetlinks/rule-editor/index.html#flow/${fileValue.id}`)
                }
            })
        })
    };
    return (
        <Modal
            visible
            title="创建规则实例"
            onCancel={() => props.close()}
            onOk={() => { save() }}
        >
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>

                <Form.Item
                    key="id"
                    label="ID"
                >
                    {getFieldDecorator('id', {
                        rules: [{ required: true, message: '请输入实例ID' }],
                    })(<Input placeholder="请输入实例ID" />)}
                </Form.Item>
                <Form.Item
                    key="name"
                    label="名称"
                >
                    {getFieldDecorator('name', {
                    })(<Input placeholder="请输入名称" />)}
                </Form.Item>
                <Form.Item
                    key="description"
                    label="说明"
                >
                    {getFieldDecorator('description', {
                    })(<Input.TextArea rows={3} />)}
                </Form.Item>

            </Form>
        </Modal>
    )
}
export default Form.create<Props>()(Save);