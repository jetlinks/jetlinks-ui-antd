import { Modal, Form, Input, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { FormComponentProps } from "antd/es/form";
import Service from "../../service";
import { NotificationProvider } from "../../data";
import apis from "@/services";
import encodeQueryParam from "@/utils/encodeParam";

interface Props extends FormComponentProps {
    close: Function;
    data: any
};
const Save: React.FC<Props> = (props) => {
    const { form: { getFieldsValue, getFieldDecorator, setFieldsValue }, data } = props;
    const service = new Service('notifications/subscribe');
    const [provider, setProvider] = useState<NotificationProvider[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [productId, setProductId] = useState<string>(data?.topicConfig?.productId);

    const [devices, setDevices] = useState<any[]>([]);
    const [deviceId, setDeviceId] = useState<string>(data?.topicConfig?.deviceId);

    const [alarms, setAlarms] = useState<any[]>([]);
    const [type, setType] = useState<string>(data?.topicProvider);

    useEffect(() => {
        service.notificationProvider()
            .subscribe(resp => setProvider(resp));
    }, []);
    const save = () => {
        const formData = getFieldsValue();
        service.saveSubscribe({ ...formData, id: data.id }).subscribe((resp) => {
            message.success('保存成功');
            props.close();
        })
    };

    //获取产品列表
    useEffect(() => {
        apis.deviceProdcut.query({}).then(resp => {
            setProducts(resp.result?.data);
        });
    }, []);
    useEffect(() => {
        // setFieldsValue({ 'topicConfig.deviceId': '' });
        if (productId) {
            apis.deviceInstance.list(encodeQueryParam({
                terms: {
                    productId: productId,
                }
            })).then(resp => {
                setDevices(resp.result?.data);
            });
        }
    }, [productId]);

    useEffect(() => {
        if (productId || deviceId) {
            service.deviceAlarm(encodeQueryParam({
                terms: {
                    target: 'product',
                    targetId: productId
                }
            })).subscribe(resp => {
                setAlarms(resp?.data);
            });
        }
    }, [productId, deviceId]);
    const renderConfig = () => {
        switch (type) {
            case 'device_alarm':
                return (
                    <>
                        <Form.Item label="产品ID">
                            {
                                getFieldDecorator(`topicConfig.productId`, {
                                    rules: [{ required: true }],
                                    initialValue: data?.topicConfig?.productId
                                })(
                                    <Select onChange={(e: string) => { setProductId(e); setFieldsValue({ 'topicConfig.deviceId': '' }); }}>
                                        <Select.Option value="*">全部</Select.Option>
                                        {
                                            products.map((item: any) => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)
                                        }
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item label="设备ID">
                            {
                                getFieldDecorator(`topicConfig.deviceId`, {
                                    rules: [{ required: true }],
                                    initialValue: data?.topicConfig?.deviceId
                                })(
                                    <Select onChange={(e: string) => setDeviceId(e)}>
                                        <Select.Option value="*">全部</Select.Option>
                                        {
                                            devices.map((item: any) => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)
                                        }
                                    </Select>
                                )
                            }
                        </Form.Item>
                        <Form.Item label="告警ID">
                            {
                                getFieldDecorator(`topicConfig.alarmId`, {
                                    rules: [{ required: true }],
                                    initialValue: data?.topicConfig?.alarmId
                                })(
                                    <Select>
                                        <Select.Option value="*">全部</Select.Option>
                                        {
                                            alarms.map((item: any) => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)
                                        }
                                    </Select>
                                )
                            }
                        </Form.Item>
                    </>
                );
            default:
                return <div />
        }
    }
    return (
        <Modal
            title='添加订阅'
            visible
            onCancel={() => props.close()}
            onOk={() => save()}
        >
            <Form
                labelCol={{ span: 7 }}
                wrapperCol={{ span: 13 }}
            >
                <Form.Item label="订阅类型">
                    {getFieldDecorator('topicProvider', {
                        rules: [{ required: true }],
                        initialValue: data?.topicProvider
                    })(
                        <Select onChange={(e: string) => setType(e)}>
                            {provider.map(item => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="订阅名称">
                    {getFieldDecorator('subscribeName', {
                        rules: [{ required: true }],
                        initialValue: data?.subscribeName,
                    })(
                        <Input />
                    )}
                </Form.Item>
                {
                    renderConfig()
                }
            </Form>
        </Modal>
    );
}


export default Form.create<Props>()(Save);