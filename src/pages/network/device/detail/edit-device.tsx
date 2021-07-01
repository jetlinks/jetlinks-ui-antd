import React from 'react';
import { Modal, Input, Button } from 'antd';
import Form from '@/components/BaseForm';
import Select from 'antd/es/select';
import { useState } from 'react';

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
            // service.saveDeviceGateway({}).subscribe(resp => {
                        
            // })
            props.onOk()
        }
    }

    const items = [
        {
            name: 'procotol',
            label: '设备ID',
            required: true,
            options: {
                rules: [{ required: true, message: '请选择' }],
            },
            render: () => {
                return <Input />
            }
        },
        {
            name: 'product',
            label: '设备名称',
            required: true,
            options: {
                rules: [{ required: true, message: '请选择' }],
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
    ];

    return <>
        <Modal
            title={'编辑设备'}
            onOk={OnOk}
            {...extra}
        >
            <div style={{ overflow: 'hidden' }}>
                <Form
                    data={props.data}
                    items={[...items]}
                />
            </div>
        </Modal>
    </>
}

export default Edit;