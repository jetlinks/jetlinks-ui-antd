import { Form, Input, Modal, Select } from "antd";
import { FormComponentProps } from "antd/es/form";
import React, { useEffect, useState } from "react";
import Service from '../../service';
interface Props extends FormComponentProps {
    data: any;
    deviceId: string;
    close: Function;
    save: Function;
}

const Save: React.FC<Props> = props => {
    const service = new Service('device-network');
    const {
        form: { getFieldDecorator },
        form,
        data
    } = props;

    const [productList, setProductList] = useState<any[]>([]);
    const [product, setProduct] = useState<any>({});

    const getProductList = () => {
        service.getDeviceGatewayList(props.deviceId, {paging: false}).subscribe(
            (res) => {
                setProductList(res);
                if(data.id){
                    
                }
            }
        )
    }
    useEffect(() => {
        getProductList();
    }, []);

    return (
        <Modal
            title={data.id ? '编辑设备' : '新增设备'}
            visible
            width={800}
            onCancel={() => { props.close() }}
            onOk={() => {
                form.validateFields((err, fileValue) => {
                    if (err) return;
                    let data = {
                        id: fileValue.id,
                        name: fileValue.name,
                        productId: product.productId || props.data.productId,
                        productName: product.productName || props.data.productName,
                        configuration: {
                            deviceGatewayId: product.id || props.data.configuration?.deviceGatewayId,
                            deviceGatewayName: product.name || props.data.configuration?.deviceGatewayName
                        },
                        describe: fileValue.describe
                    }
                    props.save({...data});
                });
            }}
        >
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
            >
                <Form.Item label="ID">
                    {getFieldDecorator('id', {
                        rules: [{ required: true }],
                        initialValue: data?.id
                    })(
                        <Input readOnly={!!data.id} />
                    )}
                </Form.Item>
                <Form.Item label="名称">
                    {getFieldDecorator('name', {
                        rules: [{ required: true }],
                        initialValue: data?.name
                    })(
                        <Input />
                    )}
                </Form.Item>
                { !data.id && (
                        <Form.Item label="复合网关">
                    {getFieldDecorator('deviceGatewayId', {
                        rules: [{ required: true }],
                        initialValue: data?.configuration?.deviceGatewayId
                    })(
                        <Select
                            onChange={(value: string) => {
                                let pro: any = productList.filter(item => item.id === value);
                                setProduct(pro[0]);
                            }}
                        >
                            {
                                productList.map((item, index) => (
                                    <Select.Option key={index} value={item.id}>{item.name}</Select.Option>
                                ))
                            }
                        </Select>
                    )}
                </Form.Item>
                    )
                }
                <Form.Item key="description" label="说明">
                    {getFieldDecorator('describe', {
                        initialValue: data?.describe
                    })(<Input.TextArea rows={4} placeholder="请输入" />)}
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default Form.create<Props>()(Save);