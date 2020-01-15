import React, { useState, useEffect } from "react";
import { Form, Input, Select, Radio, Col, Drawer, Empty, Button, message, Row, Icon, List } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { renderUnit } from "@/pages/device/public";
import { PropertiesMeta } from "../data";
import Paramter from '../paramter';

interface Props extends FormComponentProps {
    data: Partial<PropertiesMeta>;
    save: Function;
    close: Function;
}

interface State {
    dataType: string;
    data: Partial<PropertiesMeta>;
    enumData: any[];
    parameterVisible: boolean;
    parameters: any[];
    currentParameter: any;
}

const PropertiesDefin: React.FC<Props> = (props) => {

    const initState: State = {
        dataType: props.data.valueType?.type || '',
        data: props.data,
        enumData: [],
        parameterVisible: false,
        parameters: props.data.valueType?.parameter || [],
        currentParameter: {}
    }

    const { form: { getFieldDecorator } } = props;

    const [dataType, setDataType] = useState(initState.dataType);
    const [enumData, setEnumData] = useState(initState.enumData);
    const [parameterVisible, setParameterVisible] = useState(initState.parameterVisible);
    const [parameters, setParameters] = useState(initState.parameters);
    const [currentParameter, setCurrentParameter] = useState(initState.currentParameter);


    useEffect(() => {
        if (dataType === 'enum') {
            const elements = props.data.valueType?.elements || [];
            setEnumData(elements);
        }
    }, []);

    const dataTypeChange = (value: string) => {
        setDataType(value);
    }

    const getFormData = () => {
        const { form } = props;
        const id = props.data.id;
        console.log(parameters, 'params');
        form.validateFields((err: any, fieldValue: any) => {
            if (err) return;
            if (dataType === 'enum') {
                fieldValue.valueType.elements = enumData;
            }
            if (dataType === 'object') {
                fieldValue.valueType.parameter = parameters;
            }
            // console.log({ ...fieldValue, id });
            props.save({ ...fieldValue, id });
        });
    }

    const renderDataType = () => {
        const { form: { getFieldDecorator } } = props;
        switch (dataType) {
            case 'float':
            case 'double':
            case 'int':
                return (
                    <div>
                        <Form.Item label='取值范围' style={{ height: 69 }}>

                            <Col span={11}>
                                {getFieldDecorator('valueType.min', {
                                    rules: [{ required: true, message: '请输入最小值' }],
                                    initialValue: (initState.data.valueType || {}).min,
                                })(<Input
                                    placeholder="最小值"
                                />)}
                            </Col>
                            <Col span={2} push={1}>
                                ~
                             </Col>
                            <Col span={11}>
                                <Form.Item>
                                    {getFieldDecorator('valueType.max', {
                                        rules: [{ required: true, message: '请输入最大值' }],
                                        initialValue: (initState.data.valueType || {}).max,
                                    })(<Input
                                        placeholder="最大值"
                                    />)}
                                </Form.Item>
                            </Col>
                        </Form.Item>

                        <Form.Item label="步长">
                            {getFieldDecorator('valueType.step', {
                                rules: [{ required: true, message: '请输入步长' }],
                                initialValue: (initState.data.valueType || {}).step
                            })(
                                <Input placeholder="请输入步长" />
                            )}
                        </Form.Item>
                        <Form.Item label="单位">
                            {getFieldDecorator('valueType.unit', {
                                rules: [{ required: true, message: '请选择单位' }],
                                initialValue: (initState.data.valueType || {}).unit
                            })(
                                renderUnit()
                            )}
                        </Form.Item>
                    </div>
                );
            case 'string':
                return (
                    <div>
                        <Form.Item label="数据长度">
                            {getFieldDecorator('valueType.length', {
                                rules: [{ required: true, message: '请输入数据长度' }],
                                initialValue: (initState.data.valueType || {}).length,
                            })(
                                <Input addonAfter="字节" />
                            )}
                        </Form.Item>
                    </div>
                );
            case 'bool':
                return (
                    <div>
                        <Form.Item label="布尔值">
                            {getFieldDecorator('valueType.true', {
                                rules: [{ required: true, message: "请输入对应数据" }],
                                initialValue: (initState.data.valueType || {}).true,
                            })(
                                <Input addonBefore="0" placeholder="如：关" />
                            )}
                            <Form.Item>
                                {getFieldDecorator('valueType.false', {
                                    rules: [{ required: false }],
                                    initialValue: (initState.data.valueType || {}).false,
                                })(
                                    <Input addonBefore="1" placeholder="如：开" />
                                )}
                            </Form.Item>
                        </Form.Item>
                    </div>
                )
            case 'date':
                return (
                    <div>
                        <Form.Item label="时间格式">
                            {getFieldDecorator('dateTemplate', {
                                initialValue: (initState.data.valueType || {}).dateTemplate,
                            })(
                                <Select>
                                    <Select.Option value="string">String类型的UTC时间戳 (毫秒)</Select.Option>
                                    <Select.Option value="yyyy-MM-dd">yyyy-MM-dd</Select.Option>
                                    <Select.Option value="yyyy-MM-dd HH:mm:ss">yyyy-MM-dd HH:mm:ss</Select.Option>
                                    <Select.Option value="yyyy-MM-dd HH:mm:ss EE">yyyy-MM-dd HH:mm:ss EE</Select.Option>
                                    <Select.Option value="yyyy-MM-dd HH:mm:ss zzz">yyyy-MM-dd HH:mm:ss zzz</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                    </div>
                )
            case 'array':
                return (
                    <div>
                        <Form.Item label="元素类型">
                            {getFieldDecorator('valueType.arrayType', {
                                rules: [{ required: true }],
                                initialValue: (initState.data.valueType || {}).arrayType,
                            })(
                                <Radio.Group>
                                    <Radio value="int32">int32(整数型)</Radio>
                                    <Radio value="float">float(单精度）</Radio>
                                    <Radio value="double">double(双精度)</Radio>
                                    <Radio value="text">text(字符串)</Radio>
                                    <Radio value="object">object(结构体)</Radio>
                                </Radio.Group>
                            )}
                        </Form.Item>
                        <Form.Item label="元素个数">
                            {
                                getFieldDecorator('valueType.elementNumber', {
                                    rules: [{ required: true }],
                                    initialValue: (initState.data.valueType || {}).elementNumber,
                                })(
                                    <Input />
                                )
                            }
                        </Form.Item>
                    </div>
                )
            case 'enum':
                return (
                    <div>
                        <Form.Item label="枚举项">
                            {
                                enumData.length > 0 ? enumData.map((item, index) => {
                                    return (
                                        <Row key={index}>
                                            <Col span={10} >
                                                <Input placeholder="编号为：0" value={item.value} onChange={(event) => {
                                                    enumData[index].value = event.target.value;
                                                    setEnumData([...enumData]);
                                                }} />
                                            </Col>
                                            <Col span={2} style={{ textAlign: 'center' }} >
                                                <Icon type="arrow-right" />
                                            </Col>
                                            <Col span={10}>
                                                <Input placeholder="对该枚举项的描述" value={item.key} onChange={(event) => {
                                                    enumData[index].key = event.target.value;
                                                    setEnumData([...enumData]);
                                                }} />
                                            </Col>
                                            <Col span={2} style={{ textAlign: 'center' }} >
                                                {index === 0 ?
                                                    <Icon type="plus-circle" onClick={() => {
                                                        setEnumData(
                                                            [...enumData, { id: enumData.length + 1 }]
                                                        );
                                                    }} /> :
                                                    <Icon type="minus-circle" onClick={() => {
                                                        enumData.splice(index, 1)
                                                        setEnumData([...enumData]);
                                                    }} />}
                                            </Col>
                                        </Row>
                                    )
                                }) :
                                    <Row justify="space-around" align="middle">
                                        <Col span={10} >
                                            <Input placeholder="编号为：0" onChange={(event) => {

                                                enumData[0] = {
                                                    value: event.target.value,
                                                }
                                                setEnumData([...enumData]);
                                            }} />
                                        </Col>
                                        <Col span={2} style={{ textAlign: 'center' }} >
                                            <Icon type="arrow-right" />
                                        </Col>
                                        <Col span={10}>
                                            <Input placeholder="对该枚举项的描述" onChange={(event) => {
                                                enumData[0] = {
                                                    key: event.target.value,
                                                }
                                                setEnumData([...enumData]);
                                            }} />
                                        </Col>
                                        <Col span={2} style={{ textAlign: 'center' }} >
                                            <Icon type="plus-circle" onClick={() => {
                                                setEnumData(
                                                    [...enumData, { id: enumData.length + 1 }]
                                                );
                                            }} />
                                        </Col>
                                    </Row>
                            }
                        </Form.Item>
                    </div>
                )
            case 'object':
                return (
                    <Form.Item label='JSON对象'>

                        {
                            (parameters.length > 0) &&
                            <List
                                bordered
                                dataSource={parameters}
                                renderItem={
                                    (item: any) => (
                                        <List.Item
                                            actions={[
                                                <Button type="link" onClick={() => { setParameterVisible(true); setCurrentParameter(item) }}>编辑</Button>,
                                                <Button type="link" onClick={() => {
                                                    const index = parameters.findIndex((i: any) => i.id === item.id);
                                                    parameters.splice(index, 1);
                                                    setParameters([...parameters]);
                                                }}>删除</Button>
                                            ]}
                                        >
                                            参数名称：{item.name}
                                        </List.Item>
                                    )
                                }
                            />
                        }
                        <Button type="link" onClick={() => { setParameterVisible(true); setCurrentParameter({}) }}><Icon type='plus' />添加参数</Button>
                    </Form.Item>
                );
            case 'file':
                return (
                    <Form.Item label="文件类型">
                        {
                            getFieldDecorator('valueType.fileType', {
                                rules: [{ required: true }],
                                initialValue: (initState.data.valueType || {}).fileType,
                            })(
                                <Select>
                                    <Select.Option value='url'>URL(链接)</Select.Option>
                                    <Select.Option value='base64'>Base64(Base64编码)</Select.Option>
                                    <Select.Option value='binary'>Binary(二进制)</Select.Option>
                                </Select>
                            )
                        }
                    </Form.Item>
                )
            default:
                return;
        }
    }


    return (
        <div>

            <Drawer
                title="编辑属性"
                placement="right"
                closable={false}
                onClose={() => props.close()}
                visible
                width={'30%'}
            >
                <Form >
                    <Form.Item label='属性标识'>
                        {getFieldDecorator('id', {
                            rules: [{ required: true, message: '请输入属性标识' }],
                            initialValue: initState.data.id,
                        })(
                            <Input
                                style={{ width: '100%' }}
                                placeholder="请输入属性标识"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label='属性名称'>
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入属性名称' }],
                            initialValue: initState.data.name,
                        })(
                            <Input
                                style={{ width: '100%' }}
                                placeholder="请输入属性名称"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item label='数据类型'>
                        {getFieldDecorator('valueType.type', {
                            rules: [{ required: true, message: '请选择' }],
                            initialValue: (initState.data.valueType || {}).type,
                        })(
                            <Select placeholder="请选择" onChange={(value: string) => { dataTypeChange(value) }}>
                                <Select.OptGroup label="基本类型">
                                    <Select.Option value="int">int(整数型)</Select.Option>
                                    <Select.Option value="float">float(单精度浮点型)</Select.Option>
                                    <Select.Option value="double">double(双精度浮点数)</Select.Option>
                                    <Select.Option value="string">text(字符串)</Select.Option>
                                    <Select.Option value="bool">bool(布尔型)</Select.Option>
                                </Select.OptGroup>
                                <Select.OptGroup label="其他类型">
                                    <Select.Option value="date">date(时间型)</Select.Option>
                                    <Select.Option value="enum">enum(枚举)</Select.Option>
                                    <Select.Option value="array">array(数组)</Select.Option>
                                    <Select.Option value="object">object(结构体)</Select.Option>
                                    <Select.Option value="file">file(文件)</Select.Option>
                                </Select.OptGroup>
                            </Select>,
                        )}
                    </Form.Item>
                    {renderDataType()}

                    <Form.Item label="是否只读">
                        {
                            getFieldDecorator('expands.readOnly', {
                                rules: [{ required: true }],
                                initialValue: (initState.data.expands || {}).readOnly,
                            })(
                                <Radio.Group >
                                    <Radio value={'true'}>是</Radio>
                                    <Radio value={'false'}>否</Radio>
                                </Radio.Group>
                            )
                        }
                    </Form.Item>
                    <Form.Item label="设备上报">
                        {
                            getFieldDecorator('expands.report', {
                                rules: [{ required: true }],
                                initialValue: (initState.data.expands || {}).report,
                            })(
                                <Radio.Group >
                                    <Radio value={'true'}>是</Radio>
                                    <Radio value={'false'}>否</Radio>
                                </Radio.Group>
                            )
                        }
                    </Form.Item>
                    <Form.Item label="描述">
                        {
                            getFieldDecorator('description', {
                                initialValue: initState.data.description,
                            })(
                                <Input.TextArea rows={3} />
                            )
                        }
                    </Form.Item>
                </Form>

                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e9e9e9',
                        padding: '10px 16px',
                        background: '#fff',
                        textAlign: 'right',
                    }}
                >
                    <Button onClick={() => { props.close() }} style={{ marginRight: 8 }}>
                        关闭
                </Button>
                    <Button onClick={() => { getFormData() }} type="primary">
                        保存
                </Button>
                </div>
                {
                    parameterVisible &&
                    <Paramter
                        save={(item) => {
                            const index = parameters.findIndex((e: any) => e.id === item.id);
                            index === -1 ? parameters.push(item) : parameters[index] = item;
                            setParameters(parameters);
                            message.success('保存成功');
                        }}
                        close={() => setParameterVisible(false)}
                        data={currentParameter}
                    />
                }
            </Drawer >

        </div>

    );
}

export default Form.create<Props>()(PropertiesDefin);
