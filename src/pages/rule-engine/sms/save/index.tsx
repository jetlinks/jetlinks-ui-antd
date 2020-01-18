import React, { useState, useEffect } from "react"
import { Modal, Form, Input, Select } from "antd"
import { FormComponentProps } from "antd/lib/form"
import { SmsItem } from "../data";
import Editable from './Editable';
import apis from "@/services";

interface Props extends FormComponentProps {
    close: Function;
    save: Function;
    data: Partial<SmsItem>;
}

interface State {
    providerList: any[],
    configuration: any[]
}
const Save: React.FC<Props> = (props) => {
    const { form: { getFieldDecorator }, form } = props;
    const initState: State = {
        providerList: [],
        configuration: props.data.configuration || []
    }
    const [providerList, setProviderList] = useState(initState.providerList);
    const [configuration, setConfiguration] = useState(initState.configuration);

    const submitData = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;
            const id = props.data.id;
            props.save({ id, configuration: configuration, ...fileValue });
        });
    }

    useEffect(() => {
        apis.sms.providerList().then(e => {
            setProviderList(e.result);
        }).catch(() => {

        });
    }, []);

    return (
        <Modal
            visible
            title={`${(props.data || {}).id}` ? '编辑短信配置' : '新增短信配置'}
            onOk={() => { submitData() }}
            onCancel={() => { props.close(); }}
            width={640}
        >
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>

                <Form.Item
                    key="name"
                    label="名称"
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true }],
                        initialValue: (props.data || {}).name,
                    })(<Input placeholder="请输入" />)}
                </Form.Item>
                <Form.Item
                    key="provider"
                    label="服务商"
                >
                    {getFieldDecorator('provider', {
                        rules: [{ required: true }],
                        initialValue: (props.data || {}).provider,
                    })(
                        <Select>
                            {providerList.map(item =>
                                <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            )}
                        </Select>
                    )}
                </Form.Item>

                <Form.Item
                    key="description"
                    label="描述"
                >
                    {getFieldDecorator('description', {
                        initialValue: (props.data || {}).description,
                    })(<Input.TextArea rows={3} />)}
                </Form.Item>

                <Form.Item label="其他配置">
                    <Editable
                        data={configuration}
                        save={(data: any) => {
                            setConfiguration(data)
                        }}
                    />
                </Form.Item>

            </Form >
        </Modal >
    )
}
export default Form.create<Props>()(Save);

