import React, { useState } from 'react';
import { Modal, Form, Input, Select, Switch } from 'antd';
import { FormComponentProps } from 'antd/es/form';

interface Props extends FormComponentProps {
    data: any;
    close: Function;
    save: Function;
    deviceId: string;
    opcUaId: string;
}

const PointSave: React.FC<Props> = props => {

    const {
        form: { getFieldDecorator },
        form,
        data,
    } = props;

    const [dataMode, setDataMode] = useState(data.dataMode);
    const [enableCalculate, setEnableCalculate] = useState<boolean>(data.enableCalculate || false);
    const [calculateType, setCalculateTypee] = useState(data.calculateType);

    const saveData = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;
            if(!fileValue.enableCalculate){
                fileValue.configuration = {},
                fileValue.calculateType = ""
            }
            props.save({ ...data, ...fileValue, deviceId: props.deviceId, opcUaId: props.opcUaId });
        })
    };

    return (
        <Modal
            width={760}
            title={`${props.data.id ? '编辑' : '新建'}点位`}
            visible
            onCancel={() => props.close()}
            onOk={() => {
                saveData();
            }}
        >
            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                <Form.Item label="名称">
                    {getFieldDecorator('name', {
                        rules: [{ message: '请输入', required: true }],
                        initialValue: data.name,
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="OPC点位ID">
                    {getFieldDecorator('opcPointId', {
                        rules: [{ required: true, message: '请输入' }],
                        initialValue: data.opcPointId
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="属性ID">
                    {getFieldDecorator('property', {
                        rules: [{ required: true, message: '请选择' }],
                        initialValue: data.property
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="数据类型">
                    {getFieldDecorator('dataType', {
                        rules: [{ required: true, message: '请选择' }],
                        initialValue: data.dataType
                    })(
                        <Select placeholder="请选择">
                            <Select.Option value="int">int(整数型)</Select.Option>
                            <Select.Option value="long">long(长整数型)</Select.Option>
                            <Select.Option value="float">float(单精度浮点型)</Select.Option>
                            <Select.Option value="double">double(双精度浮点数)</Select.Option>
                            <Select.Option value="string">text(字符串)</Select.Option>
                            <Select.Option value="boolean">bool(布尔型)</Select.Option>
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="数据模式">
                    {getFieldDecorator('dataMode', {
                        rules: [{ required: true, message: '请选择' }],
                        initialValue: data.dataMode
                    })(
                        <Select onChange={(value: string) => {
                            setDataMode(value);
                        }}>
                            <Select.Option key="pull" value="pull">pull</Select.Option>
                            <Select.Option key="sub" value="sub">sub</Select.Option>
                        </Select>,
                    )}
                </Form.Item>
                {dataMode === 'pull' ?
                    <Form.Item label="拉取间隔">
                        {getFieldDecorator('interval', {
                            rules: [{ required: true, message: '请输入' }],
                            initialValue: data.interval
                        })(<Input />)}
                    </Form.Item> :
                    <Form.Item label="采样频率">
                        {getFieldDecorator('interval', {
                            rules: [{ required: true, message: '请输入' }],
                            initialValue: data.interval
                        })(<Input />)}
                    </Form.Item>}
                <Form.Item label="是否开启计算">
                    {getFieldDecorator('enableCalculate', {
                        initialValue: data.enableCalculate,
                        valuePropName: 'checked',
                        rules: [{ required: true }]
                    })(<Switch onChange={(value) => {
                        setEnableCalculate(value)
                    }} />)}
                </Form.Item>
                {
                    enableCalculate && (
                        <>
                            <Form.Item label="计算类型">
                                {getFieldDecorator('calculateType', {
                                    rules: [{ required: true, message: '请选择' }],
                                    initialValue: data.calculateType
                                })(<Select onChange={(value: string) => {
                                    setCalculateTypee(value);
                                }}>
                                    <Select.Option key="number" value="number">数值计算</Select.Option>
                                </Select>)}
                            </Form.Item>
                            {
                                calculateType === 'number' && (
                                    <>
                                        <Form.Item label="初始值">
                                            {getFieldDecorator('configuration.initialValue', {
                                                rules: [{ required: true, message: '请输入' }],
                                                initialValue: data.configuration?.initialValue
                                            })(<Input />)}
                                        </Form.Item>
                                        <Form.Item label="倍数">
                                            {getFieldDecorator('configuration.multiple', {
                                                rules: [{ required: true, message: '请输入' }],
                                                initialValue: data.configuration?.multiple
                                            })(<Input />)}
                                        </Form.Item>
                                    </>
                                )
                            }
                        </>
                    )
                }
                <Form.Item label="描述">
                    {getFieldDecorator('description', {
                        initialValue: data.description,
                    })(<Input.TextArea rows={3} />)}
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default Form.create<Props>()(PointSave);
