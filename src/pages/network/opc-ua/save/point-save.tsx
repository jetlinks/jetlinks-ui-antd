import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import apis from '@/services';

interface Props extends FormComponentProps {
    data: any;
    close: Function;
    save: Function;
    deviceId: string;
}

const PointSave: React.FC<Props> = props => {

    const {
        form: { getFieldDecorator },
        form,
        data,
    } = props;

    const [dataMode, setDataMode] = useState("pull");

    useEffect(() => {

    }, []);

    const saveData = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;
            props.save({ ...data, ...fileValue, deviceId: props.deviceId });
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
                    })(<Input />)}
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
