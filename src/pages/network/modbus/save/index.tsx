import React, { useEffect, useState } from 'react';
import Form from 'antd/es/form';
import { FormComponentProps } from 'antd/lib/form';
import { Input, message, Modal, Select, Spin } from 'antd';
import apis from '@/services';

interface Props extends FormComponentProps {
    close: Function;
    data: any;
}

const Save = (props: Props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [clusterList, setClusterList] = useState<any[]>([]);
    const {
        form: { getFieldDecorator },
        form,
    } = props;
    const submitData = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;
            apis.modbus.updataChanel({...props.data, ...fileValue}).then(resp => {
                if(resp.status === 200){
                    message.success('操作成功！');
                    props.close()
                }
            })
        });
    };
    const queryClusterList = () => {
        apis.opcUa.clusterList().then(res => {
            if (res.status === 200) {
                setClusterList(res.result);
            }
        })
    };

    useEffect(() => {
        queryClusterList()
        setLoading(false)
    }, []);

    return (
        <Modal
            title={`${props.data.id ? '编辑' : '新建'}`}
            visible
            okText="确定"
            cancelText="取消"
            onOk={() => {
                submitData();
            }}
            onCancel={() => props.close()}
        >
            <Spin spinning={loading}>
                <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                    <Form.Item key="name" label="名称">
                        {getFieldDecorator('name', {
                            rules: [
                                { required: true, message: '请输入名称' }
                            ],
                            initialValue: props.data.name,
                        })(<Input placeholder="请输入名称" />)}
                    </Form.Item>
                    <Form.Item key="host" label="IP">
                        {getFieldDecorator('host', {
                            rules: [
                                { required: true, message: '请选择' }
                            ],
                            initialValue: props.data.host,
                        })(<Input placeholder="请输入" />)}
                    </Form.Item>
                    <Form.Item key="port" label="端口">
                        {getFieldDecorator('port', {
                            rules: [
                                { required: true, message: '请输入' }
                            ],
                            initialValue: props.data.port,
                        })(<Input placeholder="请输入" />)}
                    </Form.Item>
                    <Form.Item key="serverId" label="集群">
                        {getFieldDecorator('serverId', {
                            rules: [
                                { required: true, message: '请选择' }
                            ],
                            initialValue: props.data.serverId,
                        })(
                            <Select placeholder="请选择">
                                {(clusterList || []).map(item => (
                                    <Select.Option key={item.id} value={item.id}>
                                        {item.id}
                                    </Select.Option>
                                ))}
                            </Select>
                        )}
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default Form.create<Props>()(Save)
