import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import apis from '@/services';

interface Props extends FormComponentProps {
    data: any;
    close: Function;
    save: Function;
}

interface State {
    certIdList: any[];
    securityMode: string;
}

const ChannelSave: React.FC<Props> = props => {
    const initState: State = {
       certIdList: [],
       securityMode: ""
    };

    const {
        form: { getFieldDecorator },
        form
    } = props;

    const [certIdList, setcertIdList] = useState(initState.certIdList);
    const [data, setData] = useState(props.data.clientConfigs ? props.data : {clientConfigs: [{}]});
    const [securityMode, setSecurityMode] = useState(initState.securityMode);

    useEffect(() => {
        apis.certificate.list({paging: false}).then(res => {
            if(res.status === 200){
                setcertIdList(res.result.data);
            }
        })
    }, []);

    const saveData = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;
            props.save({...data,...fileValue});
        })
    };

    return (
        <Modal
            width={760}
            title={`${props.data.id ? '编辑' : '新建'}OPC UA`}
            visible
            onCancel={() => props.close()}
            onOk={() => {
                saveData();
            }}
        >
            <Form labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>
                <Form.Item label="名称">
                    {getFieldDecorator('name', {
                        rules: [{ message: '请输入' }],
                        initialValue: data.name,
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="服务地址">
                    {getFieldDecorator('clientConfigs[0].endpoint', {
                        rules: [{ required: true, message: '请输入' }],
                        initialValue: data.clientConfigs[0]?.endpoint,
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="安全策略">
                    {getFieldDecorator('clientConfigs[0].securityPolicy', {
                        rules: [{ required: true, message: '请输入' }],
                        initialValue: data.clientConfigs[0]?.securityPolicy,
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="安全模式">
                    {getFieldDecorator('clientConfigs[0].securityMode', {
                        rules: [{ required: true, message: '请输入' }],
                        initialValue: data.clientConfigs[0]?.securityMode,
                    })(<Input onBlur={event => {
                        setSecurityMode(event.target.value)
                      }} />)}
                </Form.Item>
                <Form.Item label="证书ID">
                    {getFieldDecorator('clientConfigs[0].certId', {
                        rules: [{ required: securityMode==='Sign' || securityMode==="SignAndEncrypt", message: '请选择' }],
                        initialValue: data.clientConfigs[0]?.certId,
                    })(
                        <Select>
                            {certIdList.map((item: any) => (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>,
                    )}
                </Form.Item>
                <Form.Item label="用户名">
                    {getFieldDecorator('clientConfigs[0].username', {
                        rules: [{ message: '请输入' }],
                        initialValue: data.clientConfigs[0]?.username,
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="密码">
                    {getFieldDecorator('clientConfigs[0].password', {
                        rules: [{ message: '请输入' }],
                        initialValue: data.clientConfigs[0]?.password,
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="描述">
                    {getFieldDecorator('description', {
                        initialValue:data.description,
                    })(<Input.TextArea rows={3} />)}
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default Form.create<Props>()(ChannelSave);
