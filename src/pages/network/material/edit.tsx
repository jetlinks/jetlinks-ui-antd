import React from 'react';
import { Modal, Input, Button } from 'antd';
import Form from '@/components/BaseForm';
import Select from 'antd/es/select';
import { useState } from 'react';
import Type from './type';

interface EditProps {
    visible?: boolean
    data?: object
    onOk?: () => void
    onCancel?: (e: React.MouseEvent<HTMLElement>) => void
}

const Edit = (props: EditProps) => {
    const { onOk, ...extra } = props;
    const [typeVisible, setTypeVisible] = useState<boolean>(false);

    const OnOk = () => {
        // 提交数据
        if (props.onOk) {
            
            props.onOk()
        }
    }

    const items = !props.data?.id ? [
        {
            name: 'procotol',
            label: '协议',
            required: true,
            options: {
                rules: [{ required: true, message: '请选择' }],
            },
            render: () => {
                return <div style={{ display: 'flex' }}>
                    <Select>
                        <Select.Option key={1} value={1}>树莓派产品</Select.Option>
                    </Select>
                    <Button style={{ marginLeft: '16px' }}>同步平台</Button>
                </div>
            }
        },
        {
            name: 'product',
            label: '产品',
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
            name: 'type',
            label: '网关类型',
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
            name: 'zujian',
            label: '网络组件',
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
    ] : [
        {
            name: 'product',
            label: '产品',
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
            name: 'type',
            label: '网关类型',
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
            name: 'zujian',
            label: '网络组件',
            options: {
                rules: [{ required: true, message: '请选择' }],
            },
            render: () => {
                return <div>
                    <Select>
                        <Select.Option key={1} value={1}>树莓派产品</Select.Option>
                    </Select>
                    <Button style={{ width: '100%' }} type="dashed" icon="plus" onClick={() => {
                        setTypeVisible(true)
                    }}>新增网络组件</Button>
                </div>
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
            title={!props.data?.id ? '新增物' : '编辑物'}
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
        <Type
            data={{}}
            visible={typeVisible}
            onOk={() => {

            }}
            onCancel={() => {
                setTypeVisible(false)
            }}
        />
    </>
}

export default Edit;