import { Form, Input, message, Modal, Select } from "antd";
import { FormComponentProps } from "antd/es/form";
import React, { useEffect, useState } from "react";
import apis from '@/services';

interface Props extends FormComponentProps {
    data: any;
    close: Function;
    save: Function;
    id: string;
}

const ChannelEdit: React.FC<Props> = props => {
    const {
        form: { getFieldDecorator },
        form,
        data,
        id
    } = props;

    const [info, setInfo] = useState({...data});

    useEffect(() => {
        apis.edgeDevice.getChannelInfo(id, {channelDataId: data.id}).then(res => {
            if(res.status === 200){
                setInfo(res.result[0])
            }
        })
    },[])

    return (
        <Modal
            title={'编辑通道'}
            visible
            onCancel={() => { props.close() }}
            onOk={() => {
                form.validateFields((err, fileValue) => {
                    if (err) return;
                    apis.edgeDevice.saveChannel(id, {...fileValue, id: props.data.id}).then(res => {
                        if(res.status === 200){
                            message.success('保存成功！');
                            props.save();
                        }
                    })
                });
            }}
        >
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
            >
                <Form.Item label="设备名称">
                    {getFieldDecorator('deviceId', {
                        // rules: [{ required: true }],
                        initialValue: info?.deviceId,
                    })(
                        <Input readOnly={true}/>
                    )}
                </Form.Item>
                <Form.Item label="通道ID">
                    {getFieldDecorator('channelId', {
                        rules: [{ required: true }],
                        initialValue: info?.channelId,
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label="通道名称">
                    {getFieldDecorator('name', {
                        rules: [{ required: true }],
                        initialValue: info?.name,
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label="接入协议">
                    {getFieldDecorator('provider', {
                        // rules: [{ required: true }],
                        initialValue: info?.provider,
                    })(
                        <Input readOnly={true}/>
                    )}
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default Form.create<Props>()(ChannelEdit);