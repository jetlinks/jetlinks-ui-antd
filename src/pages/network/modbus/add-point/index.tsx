import React, { useEffect, useState } from 'react';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import { Icon, Input, InputNumber, message, Modal, Radio, Select, Spin, Tooltip } from 'antd';
import apis from '@/services';

interface Props extends FormComponentProps {
    close: Function;
    data: any;
    deviceId: string;
    masterId: string;
}

const AddPoint = (props: Props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [metaData, setMetaData] = useState<any[]>([]);
    const {
        data,
        masterId,
        deviceId,
        form: { getFieldDecorator },
        form,
    } = props;
    const submitData = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;
            apis.modbus.saveMetadataConfig(masterId, deviceId, { ...data, ...fileValue, metadataType: 'property', codec: 'number' }).then(resp => {
                if (resp.status === 200) {
                    message.success('操作成功！')
                    props.close()
                }
            })
        });
    };

    useEffect(() => {
        apis.deviceInstance.info(deviceId).then(resp => {
            if (resp.status === 200) {
                setLoading(false)
                const data = resp.result?.metadata || '{}'
                setMetaData(JSON.parse(data)?.properties || [])
            }
        })
    }, []);

    return (
        <Modal
            title={`${props.data.id ? '编辑' : '新建'}数据点`}
            visible
            width={700}
            okText="确定"
            cancelText="取消"
            onOk={() => {
                submitData();
            }}
            onCancel={() => props.close()}
        >
            <Spin spinning={loading}>
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                    <Form.Item key="metadataId" label="属性ID">
                        {getFieldDecorator('metadataId', {
                            rules: [
                                { required: true, message: '请选择' }
                            ],
                            initialValue: props.data?.metadataId,
                        })(<Select placeholder="请选择"
                            showSearch
                            filterOption={(input, option) =>
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                        >
                            {
                                metaData.map(item => (
                                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                ))
                            }
                        </Select>)}
                    </Form.Item>
                    <Form.Item key="function" label="功能码">
                        {getFieldDecorator('function', {
                            rules: [
                                { required: true, message: '请选择' }
                            ],
                            initialValue: props.data?.function?.value,
                        })(<Select placeholder="请选择">
                            <Select.Option value={'Coils'}>线圈寄存器</Select.Option>
                            <Select.Option value={'HoldingRegisters'}>保存寄存器</Select.Option>
                            <Select.Option value={'InputRegisters'}>输入寄存器</Select.Option>
                        </Select>)}
                    </Form.Item>
                    <Form.Item key="unitId" label="从站ID">
                        {getFieldDecorator('unitId', {
                            rules: [
                                { required: true, message: '请输入' },
                                {
                                    validator: async (rule, value, callback) => {
                                        if (value === 0 || !(/(^[1-9]\d*$)/.test(value))) {
                                            callback('请输入非0正整数');
                                        }
                                    }
                                }
                            ],
                            initialValue: props.data?.unitId,
                        })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
                    </Form.Item>
                    <Form.Item key="readIndex" label="读取起始位置">
                        {getFieldDecorator('codecConfig.readIndex', {
                            rules: [
                                { required: true, message: '请输入' },
                                {
                                    validator: async (rule, value, callback) => {
                                        if (!(/(^[0-9]\d*$)/.test(value))) {
                                            callback('请输入正整数');
                                        }
                                    }
                                }
                            ],
                            initialValue: props.data?.codecConfig?.readIndex || 0,
                        })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
                    </Form.Item>
                    <Form.Item key="readLength" label="读取长度">
                        {getFieldDecorator('codecConfig.readLength', {
                            rules: [
                                { required: true, message: '请输入' },
                                {
                                    validator: async (rule, value, callback) => {
                                        if (value === 0 || !(/(^[1-9]\d*$)/.test(value))) {
                                            callback('请输入非0正整数');
                                        }
                                    }
                                }
                            ],
                            initialValue: props.data?.codecConfig?.readLength,
                        })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
                    </Form.Item>
                    <Form.Item key="address" label={
                        <span>
                            地址&nbsp;
                            <Tooltip title="要获取的对象地址">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    }>
                        {getFieldDecorator('address', {
                            rules: [
                                { required: true, message: '请输入' },
                                {
                                    validator: async (rule, value, callback) => {
                                        if (value < 1 && value > 255) {
                                            callback('请输入1~255之间的数字!');
                                        }
                                    }
                                }
                            ],
                            initialValue: props.data.address,
                        })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
                    </Form.Item>
                    <Form.Item key="revertBytes" label="变换器寄存器高低字节">
                        {getFieldDecorator('codecConfig.revertBytes', {
                            rules: [
                                { required: true, message: '请选择' }
                            ],
                            initialValue: props.data?.codecConfig?.revertBytes || false,
                        })(
                            <Radio.Group>
                                <Radio value={false}>否</Radio>
                                <Radio value={true}>是</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <Form.Item key="scaleFactor" label={
                        <span>
                            缩放因子&nbsp;
                            <Tooltip title="基于原始数据按比例进行数据缩放。默认比例为1，不能为0">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    }>
                        {getFieldDecorator('codecConfig.scaleFactor', {
                            rules: [
                                { required: true, message: '请输入' },
                                {
                                    validator: async (rule, value, callback) => {
                                        if (value === 0) {
                                            callback('请输入不为0的数字!');
                                        }
                                    }
                                }
                            ],
                            initialValue: props.data?.codecConfig?.scaleFactor || 1,
                        })(<InputNumber style={{ width: '100%' }} placeholder="请输入" />)}
                    </Form.Item>
                    <Form.Item key="unsigned" label="数据格式转换">
                        {getFieldDecorator('codecConfig.unsigned', {
                            rules: [
                                { required: true, message: '请选择' }
                            ],
                            initialValue: props.data?.codecConfig?.unsigned || false,
                        })(
                            <Radio.Group>
                                <Radio value={false}>无符号数字</Radio>
                                <Radio value={true}>有符号数字</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <Form.Item key="interval" label={
                        <span>
                            读取数据周期&nbsp;
                            <Tooltip title="若不填写表示不定时拉取数据">
                                <Icon type="question-circle-o" />
                            </Tooltip>
                        </span>
                    }>
                        {getFieldDecorator('interval', {
                            rules: [
                                { required: false },
                                {
                                    validator: async (rule, value, callback) => {
                                        if (value && (value === 0 || !(/(^[1-9]\d*$)/.test(value)))) {
                                            callback('请输入非0正整数!');
                                        }
                                    }
                                }
                            ],
                            initialValue: props.data?.interval,
                        })(<Input addonAfter={<span>ms</span>} />)}
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default Form.create<Props>()(AddPoint)
