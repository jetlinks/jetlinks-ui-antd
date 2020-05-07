import React, { useState, useEffect } from "react";
import { Form, Input, Select, Row, Col, Tooltip, InputNumber } from "antd";
import { FormComponentProps } from "antd/lib/form";
import styles from '../index.less';

interface Props extends FormComponentProps {
    save: Function;
    metadata: any;
    onSubmit: Function;
    close: Function;
    config: any;
    data: any;
}
const LineChartEdit = (props: Props) => {
    const { form, form: { getFieldDecorator, }, metadata } = props;
    const { properties } = JSON.parse(metadata);
    const [type, setType] = useState<string>();
    const config = props.data?.config;
    // 历史数据：数据量、时间范围
    // 聚合数据：数据量、时间范围、聚合类型、时间周期
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
            setType(props.data?.config?.dimension);
        }
    }, []);



    const renderType = () => {
        if (type === 'history') {
            return (
                <>
                    <Col xl={{ span: 10, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                        <Form.Item
                            label="数据量"
                        >
                            {getFieldDecorator('history', {
                                initialValue: config?.history || 30,
                                rules: [{ required: true, message: '请输入数据量' }]
                            })(
                                <InputNumber style={{ width: '100%' }} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col xl={{ span: 10, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                        <Form.Item
                            label="时间格式"
                        >
                            {getFieldDecorator('timeFormat', {
                                initialValue: config?.timeFormat || 'yyyy-MM-dd',
                                rules: [{ required: true, message: '请输入时间格式' }]

                            })(
                                <Input />
                            )}
                        </Form.Item>
                    </Col>
                    <Col xl={{ span: 22, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                        <Tooltip title="now表示当前时间，如：now-30d">
                            <Form.Item
                                label="时间范围"
                                style={{ marginBottom: 0 }}>

                                <Form.Item

                                    style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                                >
                                    {getFieldDecorator('from', {
                                        initialValue: config?.from || 'now-7d',
                                        rules: [{ required: true }]

                                    })(
                                        <Input />
                                    )}

                                </Form.Item>
                                <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
                                <Form.Item
                                    // label="  "
                                    style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                                >
                                    {getFieldDecorator('to', {
                                        initialValue: config?.to,
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Form.Item>
                        </Tooltip>
                    </Col>
                </>
            );
        } if (type === 'agg') {
            return (
                <>
                    <Col xl={{ span: 10, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                        <Form.Item
                            label="数据量"
                        >
                            {getFieldDecorator('limit', {
                                initialValue: config?.limit || 30,
                                rules: [{ required: true, message: '请输入数据量' }]

                            })(
                                <InputNumber style={{ width: '100%' }} />
                            )}
                        </Form.Item>
                    </Col>
                    <Col xl={{ span: 10, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                        <Form.Item
                            label="聚合类型"
                        >
                            {getFieldDecorator('agg', {
                                initialValue: config?.agg || 'avg',
                                rules: [{ required: true }]

                            })(
                                <Select>
                                    <Select.Option value="avg">AVG</Select.Option>
                                    <Select.Option value="sum">SUM</Select.Option>
                                    <Select.Option value="count">COUNT</Select.Option>
                                    <Select.Option value="max">MAX</Select.Option>
                                    <Select.Option value="min">MIN</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </Col>

                    <Col xl={{ span: 22, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                        <Tooltip title="now表示当前时间，如：now-30d">
                            <Form.Item
                                label="时间范围"
                                style={{ marginBottom: 0 }}>

                                <Form.Item

                                    style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                                >
                                    {getFieldDecorator('from', {
                                        initialValue: config?.from || 'now-30d',
                                    })(
                                        <Input />
                                    )}

                                </Form.Item>
                                <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
                                <Form.Item
                                    style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                                >
                                    {getFieldDecorator('to', {
                                        initialValue: config?.to || 'now'
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>
                            </Form.Item>
                        </Tooltip>
                    </Col>

                    <Col xl={{ span: 10, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                        <Tooltip title="M:月、d:天、h:小时、m:分钟、">
                            <Form.Item label="时间间隔">
                                {getFieldDecorator('time', {
                                    initialValue: config?.time || '1d',
                                    rules: [{ required: true, message: '请输入时间间隔' }]

                                })(
                                    <Input />
                                )}
                            </Form.Item>
                        </Tooltip>
                    </Col>
                    <Col xl={{ span: 10, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                        <Form.Item
                            label="时间格式"
                        >
                            {getFieldDecorator('format', {
                                initialValue: config?.format || 'yyyy-MM-dd',
                                rules: [{ required: true, message: '请输入时间格式' }]

                            })(
                                <Input />
                            )}
                        </Form.Item>
                    </Col>
                </>
            );
        } if (type === 'realTime') {
            return (
                <>
                    <Col xl={{ span: 22, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                        <Form.Item
                            label="数据量"
                        >
                            {getFieldDecorator('history', {
                                initialValue: config?.history || 30,
                                rules: [{ required: true, message: '请输入数据量' }]
                            })(
                                <InputNumber style={{ width: '100%' }} />
                            )}
                        </Form.Item>
                    </Col>
                </>
            )
        }
        return null;

    }
    return (
        <Form className={styles.configForm} >
            <Row gutter={16}>
                <Col lg={22} push={2} md={12} sm={24}>
                    <Form.Item
                        label="名称"
                    >
                        {getFieldDecorator('name', {
                            initialValue: config?.name,
                            rules: [{ required: true, message: '请输入名称' }]

                        })(
                            <Input />)}
                    </Form.Item>
                </Col>
                <Col xl={{ span: 10, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <Form.Item
                        label="X轴"
                    >
                        {getFieldDecorator('x', {
                            initialValue: config?.x || '时间',
                            rules: [{ required: true, message: '请输入X轴名称' }]

                        })(
                            <Input placeholder="X轴名称" />
                        )}
                    </Form.Item>
                </Col>
                <Col xl={{ span: 10, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                    <Form.Item
                        label="Y轴"
                    >
                        {getFieldDecorator('y', {
                            initialValue: config?.y || '值',
                            rules: [{ required: true, message: '请输入Y轴名称' }]

                        })(
                            <Input placeholder="Y轴名称" />
                        )}
                    </Form.Item>
                </Col>
                <Col xl={{ span: 10, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <Form.Item
                        label="属性"
                    >
                        {getFieldDecorator('measurement', {
                            initialValue: config?.measurement,
                            rules: [{ required: true, message: '请选择属性' }]

                        })(
                            <Select style={{ width: "100%" }}>
                                {properties.map((i: any) => <Select.Option key={i.id} value={i.id}>{i.name}</Select.Option>)}
                            </Select>
                        )}
                    </Form.Item>
                </Col>
                <Col xl={{ span: 10, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                    <Form.Item
                        label="类型"
                    >
                        {getFieldDecorator('dimension', {
                            initialValue: config?.dimension,
                            rules: [{ required: true, message: '请选择数据类型' }]
                        })(
                            <Select onChange={(e: string) => setType(e)}>
                                <Select.Option value='history'>历史数据</Select.Option>
                                <Select.Option value='agg'>聚合数据</Select.Option>
                                <Select.Option value='realTime'>实时数据</Select.Option>
                            </Select>
                        )}
                    </Form.Item>
                </Col>
            </Row>

            {renderType()}

        </Form>

    )
}
export default Form.create<Props>()(LineChartEdit);
