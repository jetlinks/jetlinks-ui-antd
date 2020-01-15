import React from "react"
import { Modal, Form, Input, Select, Upload, Button, Icon } from "antd"
import { FormComponentProps } from "antd/lib/form"
import { CertificateItem } from "../data";

interface Props extends FormComponentProps {
    close: Function;
    save: Function;
    data: Partial<CertificateItem>;
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

    return (
        <Modal
            visible
            title={`${props.data.id ? '编辑' : '新建'}证书`}
            onOk={() => { submitData() }}
            onCancel={() => { props.close(); }}
            width={800}
        >
            <Form labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>

                <Form.Item
                    key="name"
                    label="名称"
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true }],
                        // initialValue: (props.data || {}).name,
                    })(<Input placeholder="请输入" />)}
                </Form.Item>
                <Form.Item
                    key="clientId"
                    label="类型"
                >
                    {getFieldDecorator('clientId', {
                        rules: [{ required: true }],
                        // initialValue: (props.data || {}).clientId,
                    })(<Select placeholder="请输入" />)}
                </Form.Item>
                <Form.Item
                    key="keystoreBase64"
                    label="密钥库"
                >
                    {getFieldDecorator('keystoreBase64', {
                        rules: [{ required: true }],
                        // initialValue: ((props.data || {}).secureConfiguration || {}).username,
                    })(
                        <Upload

                            name="密钥库"
                            action="/network/certificate/upload"
                            listType="picture"
                        >
                            <Button style={{ width: '100%' }}>
                                <Icon type="upload" />点击上传
                            </Button>
                        </Upload>
                    )}
                </Form.Item>
                <Form.Item
                    key="trustKeyStoreBase64"
                    label="信任库"
                >
                    {getFieldDecorator('trustKeyStoreBase64', {
                        rules: [{ required: true }],
                        // initialValue: ((props.data || {}).secureConfiguration || {}).password,
                    })(
                        <Upload

                            name="密钥库"
                            action="/network/certificate/upload"
                            listType="picture"
                        >
                            <Button style={{ width: '100%' }}>
                                <Icon type="upload" />点击上传
                        </Button>
                        </Upload>
                    )}
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