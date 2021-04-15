import { Form, Input, Modal, Select } from "antd";
import { FormComponentProps } from "antd/es/form";
import React, { useEffect, useState } from "react";

interface Props extends FormComponentProps {
    data: any;
    close: Function;
    save: Function;
    deviceId: string;
}

const AddDevice: React.FC<Props> = props => {
    const {
        form: { getFieldDecorator },
        form,
        data
    } = props;

    const [dataType, setDataType] = useState("");

    useEffect(() => {
        setDataType(data.provider)
    }, []);

    const renderType = (type: string) => {
        switch (type) {
            case 'onvif':
                return (
                    <>
                        <Form.Item label="IP地址">
                            {getFieldDecorator('url', {
                                rules: [{ required: true }],
                                initialValue: data?.others?.url
                            })(
                                <Input readOnly={!!data.id} />
                            )}
                        </Form.Item>
                        <Form.Item key="username" label="用户名">
                            {getFieldDecorator('username', {
                                rules: [{ required: true }],
                                initialValue: data?.others?.username
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item key="password" label="密码">
                            {getFieldDecorator('password', {
                                rules: [{ required: true }],
                                initialValue: data?.others?.password
                            })(
                                <Input type="password" />
                            )}
                        </Form.Item>
                    </>
                );
            default:
                return null;
        }
    }

    return (
        <Modal
            title={data.id ? "编辑视频设备" : '添加视频设备'}
            visible
            width="40vw"
            onCancel={() => { props.close() }}
            onOk={() => {
                form.validateFields((err, fileValue) => {
                    if (err) return;
                    if (!data.id) {
                        props.save({ ...fileValue });
                    } else {
                        let params = {
                            id: data.id,
                            url: data.others.url,
                            name: fileValue.name || data.name,
                            username: fileValue.username,
                            password: fileValue.password,
                            manufacturer: data.manufacturer,
                            model: data.model,
                            description: fileValue.description,
                        }
                        props.save(params);
                    }
                });
            }}
        >
            <Form
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
            >
                {/* <Form.Item label="id">
                    {getFieldDecorator('id', {
                        rules: [{ required: true }],
                        initialValue: data?.id
                    })(
                        <Input readOnly={!!data.id} />
                    )}
                </Form.Item> */}
                <Form.Item label="名称">
                    {getFieldDecorator('name', {
                        rules: [{ required: true }],
                        initialValue: data?.name
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label="协议类型">
                    {getFieldDecorator('provider', {
                        rules: [{ required: true }],
                        initialValue: data?.provider
                    })(
                        <Select placeholder="请选择"
                            onChange={(value: string) => {
                                setDataType(value);
                            }}
                        >
                            <Select.Option value="onvif" key="onvif">ONVIF</Select.Option>
                        </Select>
                    )}
                </Form.Item>
                {renderType(dataType)}
                <Form.Item key="description" label="说明">
                    {getFieldDecorator('description', {
                        initialValue: data?.description
                    })(<Input.TextArea rows={4} placeholder="请输入" />)}
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default Form.create<Props>()(AddDevice);