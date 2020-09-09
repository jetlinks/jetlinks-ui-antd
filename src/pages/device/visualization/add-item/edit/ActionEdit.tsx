import React, { useEffect, useState, useRef } from "react";
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
const ActionEdit: React.FC<Props> = (props) => {
    const { form, form: { getFieldDecorator, }, metadata } = props;
    const [sourceType, setSourceType] = useState<any>(undefined);
    const [source, setSource] = useState<any>(undefined);
    const [func, setFunc] = useState<any>(undefined);
    let actionParam = useRef<any>({});
    console.log(metadata, 'medtaas');
    const getData = () => {
        let data: any;
        form.validateFields((err, fileValue) => {
            if (err) {
                return;
            }
            data = fileValue;
        });
        return { ...data, runParam: actionParam.current };
    }
    useEffect(() => {
        // 加载后执行
        if (props.save) {
            props.save(() => getData());
        }
        if (props.data) {
            // setType(props.data?.config?.dimension);
        }
    }, []);


    const renderSource = () => {
        switch (sourceType) {
            case 'property':
                return (
                    <Col lg={22} push={2} md={12} sm={24}>
                        <Form.Item
                            label="属性"
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
                            label="功能"
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

    const [itemValue, setItemValue] = useState<string | number>('');
    const renderItem = (id: string, valueType: any) => {
        const { type } = valueType;
        switch (type) {
            case 'int':
            case 'string':
                return <Input value={itemValue} onChange={(e) => {
                    actionParam.current[id] = e.target.value;
                    setItemValue(e.target.value);
                }} />;
            case 'enum':
                return (
                    <Select style={{ width: "100%" }} onChange={e => {
                        const fn = source.inputs.find((item: any) => item.id === e);
                        setFunc(fn);
                        actionParam.current[id] = e;
                    }}>
                        {
                            (valueType.elements || []).map((item: any) =>
                                <Select.Option key={item.value} value={item.value}>
                                    {`${item.text}(${item.value})`}
                                </Select.Option>)
                        }
                    </Select>
                )
            case 'boolean':
                return (
                    <Select style={{ width: '100%' }} onChange={e => { actionParam.current[id] = e }}>
                        <Select.Option value={valueType.trueText}>{valueType.trueValue}</Select.Option>
                        <Select.Option value={valueType.falseText}>{valueType.falseValue}</Select.Option>
                    </Select>
                )
            default:
                return null;
        }

    }

    const renderFunction = () => {
        const { inputs } = source;
        return (inputs || []).map((item: any) => {
            const { valueType } = item;
            return (
                <>
                    <Col lg={11} push={1} md={6} sm={12}>
                        <Select
                            disabled
                            value={item.id}
                            style={{ width: "100%" }}
                            onChange={(e: any) => {
                                const fn = source.inputs.find((item: any) => item.id === e);
                                setFunc(fn);
                                actionParam.current[item.id] = e;
                            }}>
                            {
                                <Select.Option key={item.id} value={item.id}>
                                    {`${item.name}(${item.id})`}
                                </Select.Option>
                            }
                        </Select>
                    </Col>

                    <Col lg={11} push={1} md={6} sm={12}>
                        {renderItem(item.id, valueType)}
                    </Col>
                </>
            )
        })
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
                        label="操作类型"
                    >
                        {getFieldDecorator('sourceType', {
                            rules: [{ required: true, message: '请选择数据类型' }]

                        })(
                            <Select style={{ width: "100%" }} onChange={e => setSourceType(e)}>
                                <Select.Option value="property">属性</Select.Option>
                                <Select.Option value="function">功能</Select.Option>
                            </Select>
                        )}
                    </Form.Item>
                </Col>

                {
                    sourceType && renderSource()
                }
                {
                    source && renderFunction()
                }
            </Row>
        </Form>

    )
}
export default Form.create<any>()(ActionEdit)