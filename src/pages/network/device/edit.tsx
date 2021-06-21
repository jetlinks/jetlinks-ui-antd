import React from 'react';
import { Modal, Input } from 'antd';
import Form from '@/components/BaseForm';
import Select from 'antd/es/select';

interface EditProps {
    visible?: boolean
    data?: object
    onOk?: () => void
    onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}

const Edit = (props: EditProps) => {
    const { onOk, ...extra } = props;

    const OnOk = () => {
        // 提交数据
        if (props.onOk) {
            props.onOk()
        }
    }

    return <>
        <Modal
            title={!props.data?.id ? '新增设备' : '编辑设备'}
            onOk={OnOk}
            {...extra}
        >
            <div style={{ overflow: 'hidden' }}>
                <Form
                    data={props.data}
                    items={[
                        {
                            name: 'id',
                            label: '设备ID',
                            required: true,
                            options: {
                                rules: [{ required: true, message: '请输入' }],
                            },
                            render: () => {
                                return <Input />
                            }
                        },
                        {
                            name: 'product',
                            label: '产品名称',
                            required: true,
                            options: {
                                rules: [{ required: true, message: '请输入' }],
                            },
                            render: () => {
                                return <Input />
                            }
                        },
                        {
                            name: 'type',
                            label: '物产品',
                            required: true,
                            options: {
                                rules: [{ required: true, message: '请选择' }],
                            },
                            render: () => {
                                return <Select>
                                    <Select.Option key={1} value={1}>树莓派产品</Select.Option>
                                </Select>
                            }
                        },
                        {
                            name: 'description',
                            label: '说明',
                            required: true,
                            options: {
                                rules: [{ message: '请输入' }],
                            },
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

export default Edit;