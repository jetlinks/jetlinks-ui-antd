import { Form, Row, Col, Input, Select } from "antd";
import React, { useState, useEffect } from "react";
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
const GaugeTickChartEdit = (props: Props) => {
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


        </Form>
    )
}
export default Form.create<any>()(GaugeTickChartEdit);