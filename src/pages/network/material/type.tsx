import React from 'react';
import { Modal, Input, Button } from 'antd';
import Form from '@/components/BaseForm';
import Select from 'antd/es/select';

interface EditProps {
    visible?: boolean
    data?: object
    onOk?: () => void
    onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}

const Type = (props: EditProps) => {
    const { onOk, ...extra } = props

    const OnOk = () => {
        // 提交数据
        if (props.onOk) {
            props.onOk()
        }
    }

    return <>
        <Modal
            title={"新增网络组件"}
            onOk={OnOk}
            {...extra}
        >
            <div style={{ overflow: 'hidden' }}>
                <Form
                    data={props.data}
                    items={[
                        {
                            name: 'name',
                            label: '名称',
                            required: true,
                            options: {
                                rules: [{ required: true, message: '请输入组件名称' }],
                            },
                            render: () => {
                                return <Input />
                            }
                        },
                        {
                            name: 'type',
                            label: '组件类型',
                            required: true,
                            options: {
                                rules: [{ required: true, message: '请选择' }],
                            },
                            render: () => {
                                return <Select>
                                    <Select.Option key={1} value={1}>MQTT服务</Select.Option>
                                </Select>
                            }
                        },
                        {
                            name: 'xianchengshu',
                            label: '线程树',
                            render: () => {
                                return <Select>
                                <Select.Option key={1} value={1}>树莓派产品</Select.Option>
                            </Select>
                            }
                        },
                        {
                            name: 'host',
                            label: 'HOST',
                            required: true,
                            render: () => {
                                return <Input />
                            }
                        },
                        {
                            name: 'port',
                            label: 'PORT',
                            required: true,
                            render: () => {
                                return <Input />
                            }
                        },
                        {
                            name: 'long',
                            label: '最大消息长度',
                            required: true,
                            render: () => {
                                return <Input />
                            }
                        },
                        {
                            name: 'description',
                            label: '说明',
                            required: true,
                            render: () => {
                                return <Input.TextArea rows={4} />
                            }
                        }
                    ]}
                />
            </div>
        </Modal>
    </>
}

export default Type;