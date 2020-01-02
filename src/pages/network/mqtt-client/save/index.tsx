import React from "react"
import { Modal, Form, Input } from "antd"
import { FormComponentProps } from "antd/lib/form"
import { MqttItem } from "../data";

interface Props extends FormComponentProps {
    close: Function;
    save: Function;
    data: Partial<MqttItem>;
}
const Save: React.FC<Props> = (props) => {
    const { form: { getFieldDecorator }, form } = props;
    const submitData = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;
            const id = props.data.id;
            props.save({ id, configuration: {}, ...fileValue });
        });
    }

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 16 }
        },
    };

    return (
        <Modal
            visible
            title={`${(props.data || {}).id}` ? '编辑mqtt客户端' : '新增mqtt客户端'}
            onOk={() => { submitData() }}
            onCancel={() => { props.close(); }}
            width={800}
        >
            <Form  {...formItemLayout}>

                <Form.Item
                    key="name"
                    label="客户端名称"
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true }],
                        initialValue: (props.data || {}).name,
                    })(<Input placeholder="请输入" />)}
                </Form.Item>
                <Form.Item
                    key="clientId"
                    label="clientId"
                >
                    {getFieldDecorator('clientId', {
                        rules: [{ required: true }],
                        initialValue: (props.data || {}).clientId,
                    })(<Input placeholder="请输入" />)}
                </Form.Item>
                <Form.Item
                    key="host"
                    label="host"
                >
                    {getFieldDecorator('host', {
                        rules: [{ required: true }],
                        initialValue: (props.data || {}).host,
                    })(<Input placeholder="请输入" />)}
                </Form.Item>
                <Form.Item
                    key="port"
                    label="端口"
                >
                    {getFieldDecorator('port', {
                        rules: [{ required: true }],
                        initialValue: (props.data || {}).port,
                    })(<Input />)}
                </Form.Item>
                <Form.Item
                    key="secureConfiguration.username"
                    label="用户名"
                >
                    {getFieldDecorator('secureConfiguration.username', {
                        rules: [{ required: true }],
                        initialValue: ((props.data || {}).secureConfiguration || {}).username,
                    })(<Input />)}
                </Form.Item>
                <Form.Item
                    key="secureConfiguration.password"
                    label="密码"
                >
                    {getFieldDecorator('secureConfiguration.password', {
                        rules: [{ required: true }],
                        initialValue: ((props.data || {}).secureConfiguration || {}).password,
                    })(<Input />)}
                </Form.Item>
                <Form.Item
                    key="description"
                    label="描述"
                >
                    {getFieldDecorator('description', {
                        rules: [{ required: true }],
                        initialValue: (props.data || {}).description,
                    })(<Input.TextArea rows={3} />)}
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default Form.create<Props>()(Save);