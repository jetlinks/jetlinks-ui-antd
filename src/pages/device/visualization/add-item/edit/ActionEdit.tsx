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
const ActionEdit: React.FC<Props> = (props) => {
    const { form, form: { getFieldDecorator, }, metadata } = props;
    const [urlType, setUrlType] = useState<any>(undefined);
    const [sourceType, setSourceType] = useState<any>(undefined);
    const [source, setSource] = useState<any>(undefined);
    const [func, setFunc] = useState<any>(undefined);

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

    const renderItem = (valueType: any) => {
        const { type } = valueType;
        console.log(type, 'fsdfff');
        switch (type) {
            case 'int':
            case 'string':
                return <Input />;
            case 'enum':
                return (
                    <Select style={{ width: "100%" }} onChange={e => {
                        const fn = source.inputs.find((item: any) => item.id === e);
                        setFunc(fn);
                    }}>
                        {
                            (valueType.elements || []).map((item: any) =>
                                <Select.Option key={item.id} value={item.id}>
                                    {`${item.text}(${item.id})`}
                                </Select.Option>)
                        }
                    </Select>
                )
            case 'boolean':
                return (
                    <Select>
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
        console.log(inputs, 'inpt');
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
                            }}>
                            {
                                <Select.Option key={item.id} value={item.id}>
                                    {`${item.name}(${item.id})`}
                                </Select.Option>
                            }
                        </Select>
                    </Col>

                    <Col lg={11} push={1} md={6} sm={12}>
                        {renderItem(valueType)}
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