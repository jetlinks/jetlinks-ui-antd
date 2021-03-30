import { Form, Input, Modal, Select } from "antd";
import { FormComponentProps } from "antd/es/form";
import React, { useEffect, useState } from "react";
import apis from '@/services';

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
        data,
        deviceId
    } = props;
    const [onvif, setOnvif] = useState({});

    const geOnvif = (id: string, fileValue: any) => {
        let param = {
            url: fileValue.url,
            username: fileValue.username,
            password: fileValue.password,
        }
        apis.edgeDevice.getOnvif(deviceId, param).then(res => {
            if (res.status === 200) {
                setOnvif(res.result[0]);
                if (res.result.length > 0) {
                    let data = res.result[0];
                    let mediaProfiles = (res.result[0]?.mediaProfiles || []).map((item: any, index: number) => {
                        let ra = Math.round(Math.random() * 100000);
                        return {
                            name: item.name,
                            token: item.token,
                            id: `channel${index}${ra}`
                        }
                    })
                    let params = { 
                        id: fileValue.id,
                        firmwareVersion: data.firmwareVersion,
                        hardwareId: data.hardwareId,
                        description: fileValue.description,
                        manufacturer: data.manufacturer,
                        mediaProfiles: mediaProfiles,
                        model: data.model,
                        name: fileValue.name || data.name,
                        password: data.password,
                        serialNumber: data.serialNumber,
                        url: data.url,
                        username: data.username
                    }
                    apis.edgeDevice.addOnvif(deviceId, params).then(response => {
                        if (response.status === 200) {
                            props.save();
                        }
                    })
                }
            }
        })
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
                        geOnvif(data.id, { ...fileValue });
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
                        apis.edgeDevice.addOnvif(deviceId, params).then(response => {
                            if(response.status === 200){
                                props.save();
                            }else{
                                props.close();
                            }
                        })
                    }
                });
            }}
        >
            <Form
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
            >
                <Form.Item label="id">
                    {getFieldDecorator('id', {
                        rules: [{ required: true }],
                        initialValue: data?.id
                    })(
                        <Input readOnly={!!data.id} />
                    )}
                </Form.Item>
                <Form.Item label="名称">
                    {getFieldDecorator('name', {
                        initialValue: data?.name
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label="IP地址">
                    {getFieldDecorator('url', {
                        rules: [{ required: true }],
                        initialValue: data?.others?.url
                    })(
                        <Input readOnly={!!data.id} />
                    )}
                </Form.Item>
                <Form.Item label="协议类型">
                    {getFieldDecorator('provider', {
                        rules: [{ required: true }],
                        initialValue: data?.provider
                    })(
                        <Select placeholder="请选择" disabled={!!data.id}>
                            <Select.Option value="ONVIF" key="ONVIF">ONVIF</Select.Option>
                        </Select>
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
                        <Input type="password" readOnly={!!data.id} />
                    )}
                </Form.Item>
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