import React, { useState } from "react"
import { Modal, Form, Input, Row, Col } from "antd"
import { FormComponentProps } from "antd/lib/form"
import { EmailItem } from "../data";
import Editable from "./Editable";

interface Props extends FormComponentProps {
    close: Function;
    save: Function;
    data: Partial<EmailItem>;
}
interface State {
    configuration: any[]
}
const Save: React.FC<Props> = (props) => {
    const { form: { getFieldDecorator }, form } = props;
    const submitData = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;
            const id = props.data.id;
            props.save({
                id,
                configuration: configuration
                , ...fileValue
            });
        });
    }

    const initState: State = {
        configuration: props.data.configuration || []
    }

    const [configuration, setConfiguration] = useState(initState.configuration);


    return (
        <Modal
            visible
            width={640}
            title={`${(props.data || {}).id}` ? '编辑邮件配置' : '新增邮件配置'}
            onOk={() => { submitData() }}
            onCancel={() => { props.close(); }}
        >
            <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            key="name"
                            label="模版名称"
                        >
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '模版名称必须填写' }],
                                initialValue: (props.data || {}).name,
                            })(<Input placeholder="请输入模版名称" />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            key="host"
                            label="host"
                        >
                            {getFieldDecorator('host', {
                                rules: [{ required: true, message: 'HOST必须填写' }],
                                initialValue: (props.data || {}).host,
                            })(<Input placeholder="请输入HOST" />)}
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            key="port"
                            label="端口"
                        >
                            {getFieldDecorator('port', {
                                rules: [{ required: true, message: '端口号必须填写' }],
                                initialValue: (props.data || {}).port,
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            key="username"
                            label="用户名"
                        >
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '用户名必须填写' }],
                                initialValue: (props.data || {}).username,
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={12}>
                        <Form.Item
                            key="password"
                            label="密码"
                        >
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '密码必须填写' }],
                                initialValue: (props.data || {}).password,
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            key="sender"
                            label="发件人"
                        >
                            {getFieldDecorator('sender', {
                                rules: [{ required: true, message: '发件人必须填写' }],
                                initialValue: (props.data || {}).sender,
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    key="description"
                    label="描述"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    {getFieldDecorator('description', {
                        initialValue: (props.data || {}).description,
                    })(<Input.TextArea rows={3} />)}
                </Form.Item>
                <Form.Item
                    key="configuration"
                    label="其他配置"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    <Editable
                        data={configuration}
                        save={(data: any) => {
                            setConfiguration(data)
                        }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default Form.create<Props>()(Save);