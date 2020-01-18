import { Form, Modal, Input } from "antd";
import { FormComponentProps } from "antd/es/form";
import React from "react";

interface Props extends FormComponentProps {
    close: Function;
    save: Function;
}
const Save: React.FC<Props> = (props) => {
    const { form: { getFieldDecorator }, form } = props;
    const submitData = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;
            props.save(fileValue);
        });
    }
    return (
        <Modal
            title="新建角色"
            visible
            okText="确定"
            cancelText="取消"
            onOk={() => { submitData() }}
            onCancel={() => props.close()}
        >
            <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>

                <Form.Item
                    key="id"
                    label="角色标识（ID）"
                >
                    {getFieldDecorator('id', {
                        rules: [{ required: true }]
                    })(<Input placeholder="请输入" />)}
                </Form.Item>
                <Form.Item
                    key="角色名称"
                    label="用户名"
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true }]
                    })(<Input placeholder="请输入" />)}
                </Form.Item>
                <Form.Item
                    key="describe"
                    label="描述"
                >
                    {getFieldDecorator('describe', {
                    })(<Input.TextArea rows={3} />)}
                </Form.Item>
            </Form>
        </Modal>
    );
}
export default Form.create<Props>()(Save);
