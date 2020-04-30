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
const GaugeChartEdit = (props: Props) => {
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
                <Col lg={22} push={2} md={12} sm={24}>
                    <Form.Item
                        label="属性"
                    >
                        {getFieldDecorator('measurement', {
                            initialValue: config?.measurement,
                            rules: [{ required: true, message: '选择属性' }]
                        })(
                            <Select style={{ width: "100%" }}>
                                {properties.map((i: any) => <Select.Option key={i.id} value={i.id}>{i.name}</Select.Option>)}
                            </Select>
                        )}
                    </Form.Item>
                </Col>
                <Col xl={{ span: 10, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                    <Form.Item
                        label="最小值"
                    >
                        {getFieldDecorator('min', {
                            initialValue: config?.min || 0
                        })(
                            <Input />
                        )}
                    </Form.Item>
                </Col>
                <Col xl={{ span: 10, offset: 2 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                    <Form.Item
                        label="最大值"
                    >
                        {getFieldDecorator('max', {
                            initialValue: config?.max || 100
                        })(
                            <Input />
                        )}
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}
export default Form.create<any>()(GaugeChartEdit);