import React, { useState } from "react";
import { FormComponentProps } from "antd/lib/form";
import { Input, Form, Row, Col, Select } from 'antd';
import { FormItemConfig } from "@/utils/common";
import { NodeProps } from "../data";
import styles from "../index.less";

interface Props extends FormComponentProps, NodeProps {
}

const MqttClient: React.FC<Props> = (props) => {

    const { form: { getFieldDecorator }, form } = props;
    const inlineFormItemLayout = {
        labelCol: {
            sm: { span: 10 },
        },
        wrapperCol: {
            sm: { span: 14 },
        },
    };

    const config: FormItemConfig[] = [
        {
            label: 'MQTT连接',
            key: 'clientId',
            styles: {
                lg: { span: 24 },
                md: { span: 24 },
                sm: { span: 24 },
            },
            component:
                <Select>
                    <Select.Option value='ONLINE'>开发中</Select.Option>
                </Select>
        },
        {
            label: '操作',
            key: 'clientType',
            styles: {
                lg: { span: 24 },
                md: { span: 24 },
                sm: { span: 24 },
            },
            component:
                <Select>
                    <Select.Option value='consumer'>接收消息</Select.Option>
                    <Select.Option value='producer'>发送消息</Select.Option>
                </Select>
        },
        {
            label: '消息体类型',
            key: 'payloadType',
            styles: {
                lg: { span: 24 },
                md: { span: 24 },
                sm: { span: 24 },
            },
            component:
                <Select>
                    <Select.Option value='JSON'>JSON</Select.Option>
                    <Select.Option value='STRING'>字符串</Select.Option>
                    <Select.Option value='BINARY'>BINARY</Select.Option>
                    <Select.Option value='HEX'>16进制字符</Select.Option>
                </Select>
        },
        {
            label: '主题（Topic）',
            key: 'topics',
            styles: {
                lg: { span: 24 },
                md: { span: 24 },
                sm: { span: 24 },
            },
            formStyle: {
                wrapperCol: { span: 24 },
                labelCol: { span: 24 },
            },
            component:
                <Input.TextArea rows={2} />
        },
        {
            label: '主题变量',
            key: 'topicVariables',
            styles: {
                lg: { span: 24 },
                md: { span: 24 },
                sm: { span: 24 },
            },
            formStyle: {
                wrapperCol: { span: 24 },
                labelCol: { span: 24 },
            },
            component:
                <Input.TextArea rows={3} placeholder="接收消息时有效: 例:/topic/{deviceId}/{key},下游通过vars变量获取占位符对应的变量." />
        },
    ];

    const saveModelData = () => {
        const temp = form.getFieldsValue();
        props.save(temp);
    }


    return (
        <Form {...inlineFormItemLayout} className={styles.configForm}>
            <Row gutter={16} >
                {config.map(item => {
                    return (
                        <Col
                            key={item.key}
                            {...item.styles}
                            onBlur={() => { saveModelData() }}
                        >
                            <Form.Item label={item.label} {...item.formStyle}>
                                {getFieldDecorator(item.key, {
                                    initialValue: props.config ? props.config[item.key] : '',
                                })(item.component)}
                            </Form.Item>
                        </Col>
                    );
                }
                )}
            </Row >
        </Form>

    );
}

export default Form.create<Props>()(MqttClient);