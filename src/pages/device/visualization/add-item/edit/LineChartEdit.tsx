import React, { useState, useEffect } from "react";
import { Form, Input, Select, Row, Col } from "antd";
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
    useEffect(() => {
        // 加载后执行
        if (props.save) {
            props.save(() => form.getFieldsValue())
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
                                initialValue: config?.history
                            })(
                                <Input />
                            )}
                        </Form.Item>
                    </Col>
                    <Col xl={{ span: 10, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                        <Form.Item
                            label="时间格式"
                        >
                            {getFieldDecorator('timeFormat', {
                                initialValue: config?.timeFormat
                            })(
                                <Input />
                            )}
                        </Form.Item>
                    </Col>
                    <Col xl={{ span: 22, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                        <Form.Item
                            label="时间范围"
                            style={{ marginBottom: 0 }}>

                            <Form.Item

                                style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                            >
                                {getFieldDecorator('from', {
                                    initialValue: config?.from
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
                                    initialValue: config?.to
                                })(
                                    <Input />
                                )}
                            </Form.Item>
                        </Form.Item>
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
                                initialValue: config?.limit
                            })(
                                <Input />
                            )}
                        </Form.Item>
                    </Col>
                    <Col xl={{ span: 10, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                        <Form.Item
                            label="聚合类型"
                        >
                            {getFieldDecorator('agg', {
                                initialValue: config?.agg
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
                        <Form.Item
                            label="时间范围"
                            style={{ marginBottom: 0 }}>

                            <Form.Item

                                style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
                            >
                                {getFieldDecorator('from', {
                                    initialValue: config?.from
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
                                    initialValue: config?.to
                                })(
                                    <Input />
                                )}
                            </Form.Item>
                        </Form.Item>
                    </Col>

                    <Col xl={{ span: 10, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                        <Form.Item label="时间间隔">
                            {getFieldDecorator('time', {
                                initialValue: config?.time
                            })(
                                <Input />
                            )}
                        </Form.Item>
                    </Col>
                    <Col xl={{ span: 10, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                        <Form.Item
                            label="时间格式"
                        >
                            {getFieldDecorator('format', {
                                initialValue: config?.format
                            })(
                                <Input />
                            )}
                        </Form.Item>
                    </Col>
                </>
            );
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
                            initialValue: config?.name
                        })(
                            <Input />)}
                    </Form.Item>
                </Col>
                <Col xl={{ span: 10, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <Form.Item
                        label="X轴"
                    >
                        {getFieldDecorator('x', {
                            initialValue: config?.x
                        })(
                            <Input />
                        )}
                    </Form.Item>
                </Col>
                <Col xl={{ span: 10, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                    <Form.Item
                        label="Y轴"
                    >
                        {getFieldDecorator('y', {
                            initialValue: config?.y
                        })(
                            <Input />
                        )}
                    </Form.Item>
                </Col>
                <Col xl={{ span: 10, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <Form.Item
                        label="属性"
                    >
                        {getFieldDecorator('measurement', {
                            initialValue: config?.measurement
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
                            initialValue: config?.dimension
                        })(
                            <Select onChange={(e: string) => setType(e)}>
                                <Select.Option value='history'>历史数据</Select.Option>
                                <Select.Option value='agg'>聚合数据</Select.Option>
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
