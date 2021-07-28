import { Form, Input, InputNumber, Modal, Select } from "antd";
import { FormComponentProps } from "antd/es/form";
import React, { useEffect, useState } from "react";
import IPInput from '@/components/BaseForm/IPInput';
import { MediaDeviceList } from "../../../service";
interface Props extends FormComponentProps {
    data: MediaDeviceList;
    close: Function;
    save: Function;
    deviceId: string;
    loading?: boolean
}

const AddDevice: React.FC<Props> = props => {
    const {
        form: { getFieldDecorator },
        form,
        data,
        loading
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
                        <Form.Item label="端口">
                            {getFieldDecorator('port', {
                                rules: [{ required: true }],
                                initialValue: data?.port
                            })(
                                <InputNumber readOnly={!!data?.port} style={{ width: '100%' }} placeholder='请输入端口' />
                            )}
                        </Form.Item>
                        <Form.Item label="IP地址">
                            {getFieldDecorator('url', {
                                rules: [{ required: true }],
                                initialValue: data?.others?.url
                            })(
                                <IPInput readOnly={!!data?.others?.url} />
                            )}
                        </Form.Item>
                        <Form.Item key="username" label="用户名">
                            {getFieldDecorator('username', {
                                // rules: [{ required: true }],
                                initialValue: data?.others?.username
                            })(
                                <Input placeholder='请输入用户名' />
                            )}
                        </Form.Item>
                        <Form.Item key="password" label="密码">
                            {getFieldDecorator('password', {
                                // rules: [{ required: true }],
                                initialValue: data?.others?.password
                            })(
                                <Input type="password" placeholder='请输入密码' />
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
            width={520}
            onCancel={() => { props.close() }}
            confirmLoading={props.loading}
            onOk={() => {
                form.validateFields((err, fileValue) => {
                    console.log(props.loading);
                    if (err) return;
                    if (!data.id) {
                        props.save({ ...fileValue });
                    } else {
                        let params = {
                            id: data.id,
                            url: data.others.url,
                            port: data.port,
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