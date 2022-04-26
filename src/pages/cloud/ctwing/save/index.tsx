import { Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { FormComponentProps } from "antd/lib/form";
import apis from "@/services";

interface Props extends FormComponentProps {
    data: any;
    close: Function;
    save: Function;
}

const Save: React.FC<Props> = props => {

    const { form: { getFieldDecorator }, form } = props;
    const [productList, setProductList] = useState([]);
    useEffect(() => {
        apis.aliyun.productList({}).then(res => {
            if (res.status === 200) {
                setProductList(res.result)
            }
        })
    }, []);

    const saveData = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;
            apis.ctwing.save(fileValue).then(res => {
                if (res.status === 200) {
                    props.save();
                }
            })
        })
    };
    return (
        <Modal
            width='40VW'
            title={props.data.id ? "编辑" : "添加"}
            visible
            okText="确定"
            cancelText="取消"
            onOk={() => { saveData() }}
            onCancel={() => props.close()}
        >
            <div>
                <Form layout="horizontal" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                    <Row justify="space-around" gutter={24}>
                        <Col span={24}>
                            <Form.Item label="ID" >
                                {getFieldDecorator('id', {
                                    initialValue: props.data?.id,
                                    rules: [{ required: true, message: '请选择' }],
                                })(
                                    <Select disabled={!!props.data.id} placeholder="请选择" allowClear
                                        showSearch
                                        optionFilterProp='children'
                                        onChange={(value: string) => {
                                            let data = '';
                                            if(value !== '' && productList){
                                                data = productList.filter((item: any) => {
                                                    return item.id === value
                                                })[0].name
                                            }
                                            form.setFieldsValue({
                                                name: data
                                            })
                                    }}>
                                        {productList && productList.map((i: any, index: number) => {
                                            return <Select.Option key={index} value={i.id}>{i.id}</Select.Option>
                                        })}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="名称">
                                {getFieldDecorator('name', {
                                    initialValue: props.data?.name,
                                    rules: [{ required: true, message: '请输入名称' }],
                                })(<Input placeholder="请输入名称" />)}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="产品ID">
                                {getFieldDecorator('ctwingProductId', {
                                    initialValue: props.data?.ctwingProductId,
                                    rules: [{ required: true, message: '请输入' }],
                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="接口地址">
                                {getFieldDecorator('apiAddress', {
                                    initialValue: props.data?.apiAddress || "https://ag-api.ctwing.cn/aep_device_management",
                                    rules: [{ required: true, message: '请输入' }],
                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="appKey">
                                {getFieldDecorator('appKey', {
                                    initialValue: props.data?.appKey,
                                    rules: [{ required: true, message: '请输入' }],
                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="appSecret">
                                {getFieldDecorator('appSecret', {
                                    initialValue: props.data?.appSecret,
                                    rules: [{ required: true, message: '请输入' }],
                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="masterKey">
                                {getFieldDecorator('masterKey', {
                                    initialValue: props.data?.masterKey,
                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="说明">
                                {getFieldDecorator('description', {
                                    initialValue: props.data?.description,
                                    rules: [{ required: false, message: '请输入' }],
                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Modal>
    )
};
export default Form.create<Props>()(Save);
