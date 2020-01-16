import React, { useState } from "react"
import { Modal, Form, Input, Select, Upload, message, Button, Icon, Col, Row } from "antd"
import { FormComponentProps } from "antd/lib/form"
import { ProtocolItem } from "../data";
import { getAccessToken } from "@/utils/authority";

interface Props extends FormComponentProps {
    close: Function;
    save: Function;
    data: Partial<ProtocolItem>;
}
interface State {
    protocolType: string | undefined;
    jarLocation: string | undefined;
}
const Save: React.FC<Props> = (props) => {
    const { form: { getFieldDecorator }, form } = props;
    const submitData = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;
            const id = props.data.id;
            props.save({
                id,
                ...fileValue
            });
        });
    }

    const initState: State = {
        protocolType: props.data.type,
        jarLocation: (props.data.configuration || {}).location,
    }

    const [jarLocation, setJarLocation] = useState(initState.jarLocation);
    const [protocolType, setProtocolType] = useState(initState.protocolType);

    const uploadProps = {
        accept: '.jar',
        name: 'file',
        action: `/jetlinks/file/static`,
        headers: {
            'X-Access-Token': getAccessToken(),
        },
        onChange(info: any) {
            if (info.file.status !== 'uploading') {
            }
            if (info.file.status === 'done') {
                setJarLocation(info.file.response.result);
                message.success(`${info.file.name} 上传成功`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} 上传失败`);
            }
        }
    }

    const renderTypeForm = () => {
        if (protocolType === 'jar') {
            return (
                <div>
                    <Form.Item
                        key="provider"
                        label="类名"
                    >
                        {
                            getFieldDecorator('configuration.provider', {
                                initialValue: (props.data.configuration || {}).provider
                            })(
                                <Input />
                            )
                        }
                    </Form.Item>
                    <Form.Item
                        key="location"
                        label="文件地址"
                    >
                        <Row>
                            <Col span={17} >
                                {
                                    getFieldDecorator('configuration.location', {
                                        initialValue: jarLocation
                                    })(
                                        <Input />
                                    )
                                }
                            </Col>
                            <Col span={4} offset={1}>
                                <Upload {...uploadProps}>
                                    <Button type="primary">
                                        <Icon type="upload" /> 上传Jar包
                                    </Button>
                                </Upload>
                            </Col>
                        </Row>
                    </Form.Item>
                </div>
            )
        } else {
            //todo脚本
            return
        }
    }

    return (
        <Modal
            visible
            width={640}
            title={`${props.data?.id ? '编辑' : '新增'}协议`}
            onOk={() => { submitData() }}
            onCancel={() => { props.close(); }}
        >
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                <Form.Item
                    key="name"
                    label="协议名称"
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '协议名称' }],
                        initialValue: (props.data || {}).name,
                    })(<Input placeholder="请输入协议名称" />)}
                </Form.Item>
                <Form.Item
                    key="type"
                    label="类型"
                >
                    {getFieldDecorator('type', {
                        rules: [{ required: true, message: '协议类型' }],
                        initialValue: (props.data || {}).type,
                    })(
                        <Select placeholder="请选择协议类型" onChange={(value: string) => { setProtocolType(value) }}>
                            <Select.Option value="jar">jar</Select.Option>
                            <Select.Option value="Script">脚本</Select.Option>
                        </Select>
                    )}
                </Form.Item>
                {
                    renderTypeForm()
                }
                <Form.Item
                    key="description"
                    label="说明"
                >
                    {
                        getFieldDecorator('description', {
                            initialValue: (props.data || {}).description
                        })(
                            <Input.TextArea rows={3} />
                        )
                    }
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default Form.create<Props>()(Save);