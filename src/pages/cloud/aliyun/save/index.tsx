import { MinusCircleOutlined } from "@ant-design/icons";
import { AutoComplete, Button, Col, Divider, Form, Input, Modal, Row, Select, Tooltip } from "antd";
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

    const [bridgeConfigs, setBridgeConfigs] = useState<any>([]);
    const [accessConfig, setAccessConfig] = useState({});
    const [productList, setProductList] = useState([]);
    const [protocolSupport, setProtocolSupport] = useState([]);
    const [productKeyList, setProductKeyList] = useState([]);
    const [deviceList, setDeviceList] = useState([]);
    const [serveIdList, setServeIdList] = useState([]);

    useEffect(() => {
        setBridgeConfigs(props.data.bridgeConfigs || [
            {
                serverId: "",
                bridgeProductKey: "",
                bridgeDeviceName: "",
                bridgeDeviceSecret: ""
            }
        ])
        setAccessConfig(props.data?.accessConfig || {
            regionId: "",
            apiEndpoint: "",
            authEndpoint: "",
            http2Endpoint: "",
            accessKeyId: "",
            accessSecret: "",
            productKey: ""
        })
        apis.aliyun.getNodesList().then(res => {
            if (res.status === 200) {
                setServeIdList(res.result)
            }
        })
        apis.aliyun.productList({}).then(res => {
            if (res.status === 200) {
                setProductList(res.result)
            }
        })

        apis.aliyun.protocolSupport().then(res => {
            if (res.status === 200) {
                setProtocolSupport(res.result)
            }
        })
        if (props.data.accessConfig) {
            getBridge(props.data?.accessConfig)
            apis.aliyun.getDevices(props.data?.accessConfig).then(res => {
                if (res.status === 200) {
                    setDeviceList(res.result?.data || [])
                }
            })
        }
    }, []);

    const saveData = () => {
        form.validateFields((err, fileValue) => {
            if (err) return;
            apis.aliyun.save(fileValue).then(res => {
                if (res.status === 200) {
                    props.save();
                }
            })
        })
    }
    const getBridge = (params: any) => {
        if(params.regionId !== '' && params.accessSecret !== '' && params.apiEndpoint !== '' && params.authEndpoint !== '' && params.accessKeyId !== ''){
            let param = {
                regionId: params.regionId,
                accessSecret: params.accessSecret,
                apiEndpoint: params.apiEndpoint,
                authEndpoint: params.authEndpoint,
                accessKeyId: params.accessKeyId,
            }
            apis.aliyun.getProducts(param).then(res => {
                if (res.status === 200) {
                    setProductKeyList(res.result?.data || [])
                }
            })
        }
    }

    return (
        <Modal
            width='60VW'
            title={props.data.id ? "编辑产品" : "添加产品"}
            visible
            okText="确定"
            cancelText="取消"
            onOk={() => { saveData() }}
            onCancel={() => props.close()}
        >
            <div>
                <Form layout="horizontal" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                    <Row justify="space-around" gutter={24}>
                        <Col span={12}>
                            <Form.Item label="产品ID" >
                                {getFieldDecorator('id', {
                                    initialValue: props.data?.id,
                                    rules: [{ required: false, message: '请选择' }],
                                })(
                                    <Select placeholder="请选择" allowClear>
                                        {productList && productList.map((i: any, index: number) => {
                                            return <Select.Option key={index} value={i.id}>{i.id}</Select.Option>
                                        })}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="产品名称">
                                {getFieldDecorator('name', {
                                    initialValue: props.data?.name,
                                    rules: [{ required: true, message: '请输入名称' }],
                                })(<Input placeholder="请输入名称" />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="编解码协议">
                                {getFieldDecorator('codecProtocol', {
                                    initialValue: props.data?.codecProtocol,
                                    rules: [{ required: true, message: '请选择' }],
                                })(<Select placeholder="请选择">
                                    {protocolSupport && protocolSupport.map((i: any, index: number) => {
                                        return <Select.Option key={index} value={i.id}>{i.name}</Select.Option>
                                    })}
                                </Select>)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="说明">
                                {getFieldDecorator('description', {
                                    initialValue: props.data?.description,
                                    rules: [{ required: false, message: '请输入' }],
                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider orientation="left" dashed><div style={{ fontWeight: 'bold' }}>认证信息配置</div></Divider>
                    <Row justify="space-around" gutter={24}>
                        <Col span={12}>
                            <Form.Item label="区域ID" >
                                {getFieldDecorator('accessConfig.regionId', {
                                    initialValue: accessConfig?.regionId,
                                    rules: [{ required: true, message: '请输入' }],
                                })(<Input placeholder="请输入" onChange={(e) => {
                                    let temp = form.getFieldValue('accessConfig.productKey')
                                    form.setFieldsValue({
                                        accessConfig: {
                                            apiEndpoint: `https://iot.${e.target.value}.aliyuncs.com`,
                                            authEndpoint: `https://iot-auth.${e.target.value}.aliyuncs.com/auth/bridge`,
                                            http2Endpoint: `https://${temp}.iot-as-http2.${e.target.value}.aliyuncs.com`,
                                        }
                                    })
                                }} onBlur={(e) => {
                                    let params = form.getFieldValue('accessConfig')
                                    getBridge({
                                        regionId: e.target.value,
                                        accessSecret: params.accessSecret,
                                        apiEndpoint: params.apiEndpoint,
                                        authEndpoint: params.authEndpoint,
                                        accessKeyId: params.accessKeyId,
                                    })
                                }}/>)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="API接口地址">
                                {getFieldDecorator('accessConfig.apiEndpoint', { //https://iot.cn-shanghai.aliyuncs.com
                                    initialValue: accessConfig?.apiEndpoint,
                                    rules: [{ required: true, message: '请输入' }],
                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="认证接口地址">
                                {getFieldDecorator('accessConfig.authEndpoint', { //https://iot-auth.cn-shanghai.aliyuncs.com/auth/bridge
                                    initialValue: accessConfig?.authEndpoint,
                                    rules: [{ required: true, message: '请输入' }],
                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="accessKey">
                                {getFieldDecorator('accessConfig.accessKeyId', {
                                    initialValue: accessConfig?.accessKeyId,
                                    rules: [{ required: true, message: '请输入' }],
                                })(<Input placeholder="请输入" onBlur={(e) => {
                                    let params = form.getFieldValue('accessConfig')
                                    getBridge({
                                        regionId: params.regionId,
                                        accessSecret: params.accessSecret,
                                        apiEndpoint: params.apiEndpoint,
                                        authEndpoint: params.authEndpoint,
                                        accessKeyId: e.target.value,
                                    })
                                }}/>)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="accessSecret">
                                {getFieldDecorator('accessConfig.accessSecret', {
                                    initialValue: accessConfig?.accessSecret,
                                    rules: [{ required: true, message: '请输入' }],
                                })(<Input placeholder="请输入"  onBlur={(e) => {
                                    let params = form.getFieldValue('accessConfig')
                                    getBridge({
                                        regionId: params.regionId,
                                        accessSecret: e.target.value,
                                        apiEndpoint: params.apiEndpoint,
                                        authEndpoint: params.authEndpoint,
                                        accessKeyId: params.accessKeyId,
                                    })
                                }}/>)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="ProductKey">
                                {getFieldDecorator('accessConfig.productKey', {
                                    initialValue: accessConfig?.productKey,
                                    rules: [{ required: true, message: '请输入' }],
                                })(
                                    <Select placeholder="请选择" allowClear onChange={(value: string) => {
                                        let temp = form.getFieldValue('accessConfig.regionId')
                                        form.setFieldsValue({
                                            accessConfig: {
                                                http2Endpoint: `https://${value}.iot-as-http2.${temp}.aliyuncs.com`,
                                            }
                                        })
                                        let config = form.getFieldValue('accessConfig')
                                        if (config.regionId !== '' && config.apiEndpoint !== '' && config.authEndpoint !== '' && config.accessKeyId !== '' && config.accessSecret !== '' && value !== '') {
                                            apis.aliyun.getDevices({
                                                regionId: config.regionId,
                                                accessSecret: config.accessSecret,
                                                apiEndpoint: config.apiEndpoint,
                                                http2Endpoint: config.http2Endpoint,
                                                productKey: value,
                                                authEndpoint: config.authEndpoint,
                                                accessKeyId: config.accessKeyId,
                                            }).then(res => {
                                                if (res.status === 200) {
                                                    setDeviceList(res.result?.data || [])
                                                    setBridgeConfigs([
                                                        {
                                                            serverId: "",
                                                            bridgeProductKey: "",
                                                            bridgeDeviceName: "",
                                                            bridgeDeviceSecret: "",
                                                        }
                                                    ])
                                                }
                                            })
                                        }
                                    }}>
                                        {productKeyList && productKeyList.map((i: any, index: number) => {
                                            return <Select.Option key={index} value={i.productKey}>{`${i.productKey}(${i.productName})`}</Select.Option>
                                        })}
                                    </Select>
                                )}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="HTTP2接口地址">
                                {getFieldDecorator('accessConfig.http2Endpoint', { //https://a1WEHOY5PU7.iot-as-http2.cn-shanghai.aliyuncs.com
                                    initialValue: accessConfig?.http2Endpoint,
                                    rules: [{ required: true, message: '请输入' }],
                                })(<Input placeholder="请输入" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider orientation="left" dashed><div style={{ fontWeight: 'bold' }}>网桥配置</div></Divider>
                    {
                        bridgeConfigs.map((item: any, index: number) => {
                            return (
                                <div key={index} style={{ backgroundColor: 'rgba(192,192,192,0.1)', marginBottom: '10px', paddingTop: '20px' }}>
                                    <div style={{ width: "90%", marginLeft: '5%' }}>网桥： {index + 1}</div>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <div style={{ width: "85%" }}>
                                            <Row gutter={24}>
                                                <Col span={12}>
                                                    <Form.Item label="本地服务ID">
                                                        {getFieldDecorator(`bridgeConfigs[${index}].serverId`, {
                                                            initialValue: item.serverId || undefined,
                                                            rules: [{ required: true, message: '本地服务ID' }],
                                                        })(<AutoComplete placeholder="本地服务ID">
                                                            {serveIdList && serveIdList.map((i: any, index: number) => {
                                                                return <AutoComplete.Option key={index} value={i.id}>{i.id}</AutoComplete.Option>
                                                            })}
                                                        </AutoComplete>)}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item label="网桥ProductKey">
                                                        {getFieldDecorator(`bridgeConfigs[${index}].bridgeProductKey`, {
                                                            initialValue: item.bridgeProductKey || undefined,
                                                            rules: [{ required: true, message: '网桥ProductKey' }],
                                                        })(<Select placeholder="网桥ProductKey" allowClear>
                                                            {deviceList && deviceList.map((i: any, index: number) => {
                                                                return <Select.Option key={index} value={i.productKey}>{i.productKey}</Select.Option>
                                                            })}
                                                        </Select>)}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item label="网桥DeviceName">
                                                        {getFieldDecorator(`bridgeConfigs[${index}].bridgeDeviceName`, {
                                                            initialValue: item.bridgeDeviceName || undefined,
                                                            rules: [{ required: true, message: '网桥DeviceName' }],
                                                        })(<Select placeholder="网桥DeviceName" allowClear>
                                                            {deviceList && deviceList.map((i: any, index: number) => {
                                                                return <Select.Option key={index} value={i.deviceName}>{i.deviceName}</Select.Option>
                                                            })}
                                                        </Select>)}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item label="网桥DeviceSecret">
                                                        {getFieldDecorator(`bridgeConfigs[${index}].bridgeDeviceSecret`, {
                                                            initialValue: item.bridgeDeviceSecret || undefined,
                                                            rules: [{ required: true, message: '网桥DeviceSecret' }],
                                                        })(<Select placeholder="网桥DeviceSecret" allowClear>
                                                            {deviceList && deviceList.map((i: any, index: number) => {
                                                                return <Select.Option key={index} value={i.deviceSecret}>{i.deviceSecret}</Select.Option>
                                                            })}
                                                        </Select>)}
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div style={{ width: "10%", display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                                            <Tooltip title="删除">
                                                <MinusCircleOutlined
                                                    onClick={() => {
                                                        bridgeConfigs.splice(index, 1)
                                                        setBridgeConfigs([...bridgeConfigs]);
                                                    }}
                                                />
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <Button icon="plus" type="link"
                        onClick={() => {
                            setBridgeConfigs([...bridgeConfigs, {
                                serverId: "",
                                bridgeProductKey: "",
                                bridgeDeviceName: "",
                                bridgeDeviceSecret: ""
                            }])
                        }}
                    >添加</Button>
                </Form>
            </div>
        </Modal>
    )
}

export default Form.create<Props>()(Save);