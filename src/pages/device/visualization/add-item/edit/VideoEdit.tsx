import React, { useEffect, useState } from "react";
import styles from '../index.less';
import { Form, Row, Col, Input, Select } from "antd";
import { FormComponentProps } from "antd/lib/form";


interface Props extends FormComponentProps {
    save: Function;
    metadata: any;
    onSubmit: Function;
    close: Function;
    config: any;
    data: any;
}
const VideoEdit: React.FC<Props> = (props) => {
    const { form, form: { getFieldDecorator, }, metadata } = props;
    const [urlType, setUrlType] = useState<any>(undefined);
    const [sourceType, setSourceType] = useState<any>(undefined);
    const [source, setSource] = useState<any>(undefined);
    const getData = () => {
        let data: any;
        form.validateFields((err, fileValue) => {
            if (err) {
                return;
            }
            data = fileValue;
        });
        return data;
    }
    useEffect(() => {
        // 加载后执行
        if (props.save) {
            props.save(() => getData())
        }
        if (props.data) {
            // setType(props.data?.config?.dimension);
        }
    }, []);

    const renderURLType = () => {
        switch (urlType) {
            case 'input':
                return (
                    <Col lg={22} push={2} md={12} sm={24}>
                        <Form.Item
                            label="视频源"
                        >
                            {getFieldDecorator('url', {
                                rules: [{ required: true, message: '请选择数据类型' }]

                            })(
                                <Input.TextArea rows={3} />
                            )}
                        </Form.Item>
                    </Col>
                )
            case 'switch':
                return (
                    <Col lg={22} push={2} md={12} sm={24}>
                        <Form.Item
                            label="来源类型"
                        >
                            {getFieldDecorator('source', {
                                rules: [{ required: true, message: '请选择数据类型' }]

                            })(
                                <Select style={{ width: "100%" }} onChange={e => setSourceType(e)}>
                                    <Select.Option value="property">属性</Select.Option>
                                    <Select.Option value="function">功能</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                )
            default:
                return null
        }
    }

    const renderSource = () => {
        switch (sourceType) {
            case 'property':
                return (
                    <Col lg={22} push={2} md={12} sm={24}>
                        <Form.Item
                            label="来源属性"
                        >
                            {getFieldDecorator('property', {
                                rules: [{ required: true, message: '请选择数据类型' }]

                            })(
                                <Select style={{ width: "100%" }} onChange={e => {
                                    const target = JSON.parse(metadata).properties.find((item: any) => item.id === e);
                                    setSource(target);
                                }}>
                                    {
                                        JSON.parse(metadata).properties.map((item: any) =>
                                            <Select.Option key={item.id} value={item.id}>
                                                {`${item.name}(${item.id})`}
                                            </Select.Option>)
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Col>

                )
            case 'function':
                return (
                    <Col lg={22} push={2} md={12} sm={24}>
                        <Form.Item
                            label="来源功能"
                        >
                            {getFieldDecorator('function', {
                                rules: [{ required: true, message: '请选择数据类型' }]

                            })(
                                <Select style={{ width: "100%" }} onChange={e => {
                                    const target = JSON.parse(metadata).functions.find((item: any) => item.id === e);
                                    setSource(target);
                                }}>
                                    {
                                        JSON.parse(metadata).functions.map((item: any) =>
                                            <Select.Option key={item.id} value={item.id}>
                                                {`${item.name}(${item.id})`}
                                            </Select.Option>)
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Col>

                )
            default:
                return null
        }
    }

    const renderVideoURl = () => {
        let type
        if (sourceType === 'property') {
            type = source?.valueType?.type;
        } else if (sourceType === 'function') {
            type = source?.output?.type;
        }
        switch (type) {
            case 'object':
                return (
                    <Col lg={22} push={2} md={12} sm={24}>
                        <Form.Item
                            label="结果"
                        >
                            {getFieldDecorator('target', {
                                rules: [{ required: true, message: '请选择数据类型' }]

                            })(
                                <Select style={{ width: "100%" }}>
                                    {
                                        source?.valueType.properties.map((item: any) =>
                                            <Select.Option key={item.id} value={item.id}>
                                                {`${item.name}(${item.id})`}
                                            </Select.Option>)
                                    }
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                )
            case 'string':
                return null;
            default:
                return (<span>暂不支持</span>)
        }

    }

    return (
        <Form className={styles.configForm} >
            <Row gutter={16}>
                <Col lg={22} push={2} md={12} sm={24}>
                    <Form.Item
                        label="名称"
                    >
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入名称' }]
                        })(
                            <Input />)}
                    </Form.Item>
                </Col>

                <Col lg={22} push={2} md={12} sm={24}>
                    <Form.Item
                        label="视频类型"
                    >
                        {getFieldDecorator('type', {
                            rules: [{ required: true, message: '请选择属性' }]

                        })(
                            <Select style={{ width: "100%" }}>
                                <Select.Option value="rtmp">RTMP</Select.Option>
                                <Select.Option value="mp4">MP4</Select.Option>
                            </Select>
                        )}
                    </Form.Item>
                </Col>
                <Col lg={22} push={2} md={12} sm={24}>
                    <Form.Item
                        label="视频源"
                    >
                        {getFieldDecorator('urlType', {
                            rules: [{ required: true, message: '请选择数据类型' }]

                        })(
                            <Select style={{ width: "100%" }} onChange={e => setUrlType(e)}>
                                <Select.Option value="input">手动输入</Select.Option>
                                <Select.Option value="switch">设备获取</Select.Option>
                            </Select>
                        )}
                    </Form.Item>
                </Col>
                {
                    urlType && renderURLType()
                }
                {
                    urlType === 'switch' && sourceType && renderSource()
                }
                {
                    urlType === 'switch' && source && renderVideoURl()
                }
            </Row>
        </Form>

    )
}
export default Form.create<any>()(VideoEdit)