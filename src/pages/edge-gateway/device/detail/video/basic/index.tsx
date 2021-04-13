import { Button, Card, Col, Input, InputNumber, message, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import Service from "./service";
import Form from "antd/es/form";
import { FormComponentProps } from "antd/lib/form";

interface Props extends FormComponentProps {
    device: any
}

const MediaDevice: React.FC<Props> = props => {

    const { form: { getFieldDecorator }, form } = props;
    const service = new Service('media/basic-server');
    const [result, setResult] = useState<any>({});
    const [type, setType] = useState<string>('');

    const saveData = () => {

        form.validateFields((err, fileValue) => {
            if (err) {
                return;
            }
            fileValue.id = result.id || Math.round(Math.random() * 1000000000).toString();
            service.saveMediaServer(props.device.id, fileValue).subscribe(() => {
                message.success('保存成功');
            },
                () => {
                    message.error('保存失败');
                });
        });
    };

    useEffect(() => {
        service.mediaServerList(props.device.id).subscribe(
            (res) => {
                if(res.length > 0){
                    setResult(res[0]);
                    setType(res[0]?.provider);
                }
            },
            () => {
            })
    }, []);

    const renderService = (type: string) => {
        switch (type) {
            case 'zlmedia':
                return (
                    <>
                        <Row>
                            <Col span={12}>
                                <Form.Item label="公网 Host" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                                    {getFieldDecorator('configuration.publicHost', {
                                        rules: [
                                            { required: true, message: '请输入公网 Host' }
                                        ],
                                        initialValue: result?.configuration?.publicHost,
                                    })(<Input placeholder='请输入公网 Host' />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="API Host" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                                    {getFieldDecorator('configuration.apiHost', {
                                        rules: [
                                            { required: true, message: '请输入API Host' }
                                        ],
                                        initialValue: result?.configuration?.apiHost,
                                    })(<Input placeholder='请输入API Host' />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="API端口" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                                    {getFieldDecorator('configuration.apiPort', {
                                        rules: [
                                            { required: true, message: '请输入API端口' }
                                        ],
                                        initialValue: result?.configuration?.apiPort,
                                    })(<InputNumber style={{ width: '100%' }} placeholder='请输入API端口' />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="RTP端口" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                                    {getFieldDecorator('configuration.rtpPort', {
                                        rules: [
                                            { required: true, message: '请输入RTP端口' }
                                        ],
                                        initialValue: result?.configuration?.rtpPort,
                                    })(<InputNumber style={{ width: '100%' }} placeholder='请输入RTP端口' />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="HTTP端口" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                                    {getFieldDecorator('configuration.httpPort', {
                                        rules: [
                                            { required: true, message: '请输入HTTP端口' }
                                        ],
                                        initialValue: result?.configuration?.httpPort,
                                    })(<InputNumber style={{ width: '100%' }} placeholder='请输入HTTP端口' />)}
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="RTMP端口" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                                    {getFieldDecorator('configuration.rtmpPort', {
                                        rules: [
                                            { required: true, message: '请输入RTMP端口' }
                                        ],
                                        initialValue: result?.configuration?.rtmpPort,
                                    })(<InputNumber style={{ width: '100%' }} placeholder='请输入RTMP端口' />)}
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item label="密钥">
                            {getFieldDecorator('configuration.secret', {
                                rules: [
                                ],
                                initialValue: result?.configuration?.secret,
                            })(<Input placeholder='请输入密钥' />)}
                        </Form.Item>
                        <Form.Item label="流媒体格式">
                            {getFieldDecorator('configuration.formats', {
                                rules: [
                                    { required: true, message: '请选择流媒体格式' }
                                ],
                                initialValue: result?.configuration?.formats,
                            })(<Select placeholder="请选择流媒体格式，多选" mode='multiple'>
                                <Select.Option value='flv'>FLV</Select.Option>
                                <Select.Option value='mp4'>MP4</Select.Option>
                                <Select.Option value='hls'>HLS</Select.Option>
                                <Select.Option value='ts'>TS</Select.Option>
                                <Select.Option value='rtc'>RTC</Select.Option>
                            </Select>)}
                        </Form.Item>
                        <Form.Item label="流ID前缀">
                            {getFieldDecorator('configuration.streamIdPrefix', {
                                initialValue: result?.configuration?.streamIdPrefix,
                            })(<Input />)}
                        </Form.Item>
                    </>
                );
            default: null;
        }
    }

    return (
        <Card style={{ width: '50%', marginTop: '20px' }}>
            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                <Form.Item key="name" label="流媒体名称">
                    {getFieldDecorator('name', {
                        rules: [
                            { required: true, message: '请输入流媒体名称' },
                            { max: 200, message: '流媒体名称不超过200个字符' }
                        ],
                        initialValue: result?.name,
                    })(<Input placeholder="请输入流媒体名称" />)}
                </Form.Item>
                <Form.Item key="provider" label="服务商">
                    {getFieldDecorator('provider', {
                        rules: [{ required: true, message: '请选择服务商' }],
                        initialValue: result?.provider,
                    })(
                        <Select placeholder="服务商" onChange={(value: string) => {
                            setType(value);
                        }}>
                            <Select.Option value="zlmedia">ZLMedia</Select.Option>
                        </Select>,
                    )}
                </Form.Item>
                {renderService(type)}
            </Form>
            <div
                style={{
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    padding: '16px',
                    background: '#fff',
                    textAlign: 'right',
                }}
            >
                <Button
                    onClick={() => {
                        saveData();
                    }}
                    type="primary"
                >
                    保存
        </Button>
            </div>
        </Card>
    )
};

export default Form.create<Props>()(MediaDevice);
