import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import { FormComponentProps } from "antd/es/form";
import { GatewayItem } from "../data";
import apis from "@/services";
import encodeQueryParam from "@/utils/encodeParam";

interface Props extends FormComponentProps {
    data: Partial<GatewayItem>;
    close: Function;
    save: Function;
}
interface State {
    providerList: any[];
    provider: any;
    supportList: any[];
    support: any;
    networkList: any[];
}

const Save: React.FC<Props> = (props) => {
    const initState: State = {
        providerList: [],
        provider: {},
        supportList: [],
        support: {},
        networkList: []
    }

    const { form: { getFieldDecorator } } = props;
    const [providerList, setProviderList] = useState(initState.providerList);
    const [provider, setProvider] = useState(initState.provider);
    const [networkList, setNetworkList] = useState(initState.networkList);
    const [supportList, setSupportList] = useState(initState.supportList);
    const [support, setSupport] = useState(initState.support);

    useEffect(() => {
        apis.gateway.providers().then(response => {
            setProviderList(response.result);
        });
        apis.gateway.supports().then(response => {
            setSupportList(response.result);
        });
    }, []);

    useEffect(() => {
        if (provider) {
            console.log('provider', provider);
            apis.network.list(encodeQueryParam({
                type: provider,
            })).then(response => {
                setNetworkList(response.result);
            })
        }
    }, [provider]);

    const renderForm = () => {
        switch (provider) {
            case 'COAP_SERVER':
                return (
                    <div>
                        <Form.Item label="Option">
                            {
                                getFieldDecorator('configuration.clientOptionNumber', {

                                })(
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="设备唯一标识Option,默认: 2100"
                                    />
                                )
                            }
                        </Form.Item>
                    </div>
                )
            case 'MQTT_CLIENT':
                return (
                    <div>

                        <Form.Item label="消息协议">
                            {
                                getFieldDecorator('configuration.protocol', {

                                })(
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="使用指定的协议解析消息"
                                    />
                                )
                            }
                        </Form.Item>

                        <Form.Item label="Topics">
                            {
                                getFieldDecorator('configuration.topics', {

                                })(
                                    <Input.TextArea rows={3}
                                        placeholder="从MQTT服务订阅Topic.多个使用,分割"
                                    />
                                )
                            }
                        </Form.Item>
                    </div>
                )
            case 'MQTT_SERVER':
                return (
                    <div></div>
                )
            default:
                return (
                    <div></div>
                )
        }
    }

    return (
        <Modal
            title={`${props.data.id ? '编辑' : '新建'}网关`}
            visible
            onCancel={() => props.close()}
        >
            <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                <Form.Item label="组件名称">
                    {
                        getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入组件名称' }],
                            initialValue: props.data?.name
                        })(
                            <Input />
                        )
                    }
                </Form.Item>
                <Form.Item label="组件类型">
                    {
                        getFieldDecorator('provider', {
                            rules: [{ required: true, message: '请选择组件类型' }],
                            initialValue: props.data?.provider
                        })(
                            <Select
                                onChange={(value: string) => { setProvider(value) }}
                            >
                                {providerList.map((item: any) =>
                                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                )}
                            </Select>
                        )
                    }
                </Form.Item>

                <Form.Item label="网络组件">
                    {
                        getFieldDecorator('networkId', {
                            rules: [{ required: true, message: '请选择组件类型' }],
                            initialValue: props.data?.networkId
                        })(
                            <Select
                                onChange={(value: string) => { setSupport(value) }}
                            >
                                {networkList.map((item: any) =>
                                    <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                )}
                            </Select>
                        )
                    }
                </Form.Item>
                {renderForm()}
                <Form.Item label="说明">
                    {
                        getFieldDecorator('describe', {

                        })(
                            <Input.TextArea rows={3} />
                        )
                    }
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default Form.create<Props>()(Save);