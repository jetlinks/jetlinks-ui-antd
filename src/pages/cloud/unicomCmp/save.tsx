import React, { useEffect, useState } from 'react';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import { Input, message, Modal, Select, Spin, TreeSelect } from 'antd';
import apis from '@/services';

interface Props extends FormComponentProps {
    close: Function;
    reload: Function;
    data: any;
}

const Save: React.FC<Props> = props => {
    const {
        form: { getFieldDecorator },
        form,
    } = props;
    const submitData = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;

            preservation(fileValue);
        });
    };

    const preservation = (item: any) => {
        if (props.data.id) {
            apis.unicom.save(props.data.id, item)
                .then((response: any) => {
                    if (response.status === 200) {
                        message.success('保存成功');
                        props.close();
                        props.reload()
                    }
                })
                .catch(() => {
                });
        } else {
            apis.unicom.saveData(item)
                .then((response: any) => {
                    if (response.status === 200) {
                        message.success('创建成功');
                        props.close();
                        props.reload()
                    }
                })
                .catch(() => {
                });
        }
    };

    useEffect(() => { }, []);

    return (
        <Modal
            title={`${props.data.id ? '编辑' : '新增'}`}
            visible
            width={650}
            okText="确定"
            cancelText="取消"
            onOk={() => {
                submitData();
            }}
            onCancel={() => props.close()}
        >
            <Spin spinning={false}>
                <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                    <Form.Item key="name" label="名称">
                        {getFieldDecorator('name', {
                            rules: [
                                { required: true, message: '请输入名称' },
                                { max: 200, message: '设备名称不超过200个字符' }
                            ],
                            initialValue: props.data.name,
                        })(<Input placeholder="请输入名称" />)}
                    </Form.Item>
                    <Form.Item key="appId" label="APP ID">
                        {getFieldDecorator('appId', {
                            rules: [
                                { required: true, message: 'APP ID' }
                            ],
                            initialValue: props.data.appId,
                        })(<Input placeholder="请输入APP ID" />)}
                    </Form.Item>
                    <Form.Item key="appSecret" label="APP SECRET">
                        {getFieldDecorator('appSecret', {
                            rules: [
                                { required: true, message: '请输入APP SECRET' }
                            ],
                            initialValue: props.data.appSecret,
                        })(<Input placeholder="请输入APP SECRET" />)}
                    </Form.Item>

                    <Form.Item key="openId" label="创建者ID">
                        {getFieldDecorator('openId', {
                            rules: [
                                { required: true, message: '请输入创建者ID' }
                            ],
                            initialValue: props.data.openId,
                        })(<Input placeholder="请输入创建者ID" />)}
                    </Form.Item>

                    <Form.Item key="explain" label="说明">
                        {getFieldDecorator('explain', {
                            initialValue: props.data.explain,
                        })(<Input.TextArea rows={4} placeholder="请输入至少五个字符" />)}
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default Form.create<Props>()(Save);
