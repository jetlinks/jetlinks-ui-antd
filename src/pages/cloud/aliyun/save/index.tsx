import { MinusCircleOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { AutoComplete, Button, Col, Divider, Form, Input, Modal, Row, Select, Tooltip } from "antd";
import React, { useEffect } from "react";
import { useState } from "react";
import { FormComponentProps } from "antd/lib/form";
import apis from "@/services";
import { SelectValue } from "antd/lib/select";

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
    const [deviceList, setDeviceList] = useState<any>([]);
    const [serveIdList, setServeIdList] = useState([]);
    const [regionIdList] = useState(['cn-qingdao', 'cn-beijing', 'cn-zhangjiakou', 'cn-huhehaote', 'cn-wulanchabu', 'cn-hangzhou', 'cn-shanghai', 'cn-shenzhen', 'cn-heyuan', 'cn-guangzhou', 'cn-chengdu'])

    useEffect(() => {
        setBridgeConfigs(props.data.bridgeConfigs || [
            {
                serverId: "",
                bridgeProductKey: "",
                bridgeDeviceName: "",
                bridgeDeviceSecret: "",
                http2Endpoint: ""
            }
        ])
        setAccessConfig(props.data?.accessConfig || {
            regionId: "",
            apiEndpoint: "",
            authEndpoint: "",
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
            let item = props.data?.accessConfig
            props.data.bridgeConfigs.map((i: any, index: number) => {
                let param = {
                    regionId: item.regionId,
                    accessSecret: item.accessSecret,
                    apiEndpoint: item.apiEndpoint,
                    authEndpoint: item.authEndpoint,
                    accessKeyId: item.accessKeyId,
                    productKey: i.bridgeProductKey
                }
                apis.aliyun.getDevices(param).then(res => {
                    if (res.status === 200) {
                        deviceList[index] = res.result?.data || []
                        setDeviceList([...deviceList])
                    }
                })
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
        if (params.regionId !== '' && params.accessSecret !== '' && params.apiEndpoint !== '' && params.authEndpoint !== '' && params.accessKeyId !== '') {
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
                <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
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
                    <Row justify="start" gutter={24}>
                        <Col span={12}>
                            <Form.Item label={
                                <span>
                                    区域ID&nbsp; <Tooltip title="地域和可用区">
                                        <QuestionCircleOutlined onClick={() => {
                                            window.open('https://help.aliyun.com/document_detail/40654.html')
                                        }} />
                                    </Tooltip>
                                </span>
                            } >
                                {getFieldDecorator('accessConfig.regionId', {
                                    initialValue: accessConfig?.regionId,
                                    rules: [{ required: true, message: '请选择' }],
                                })(
                                    <AutoComplete placeholder="本地服务ID"
                                        dataSource={regionIdList}
                                        filterOption={(inputValue, option) =>
                                            option?.props?.children?.toUpperCase()?.indexOf(inputValue.toUpperCase()) !== -1
                                        }
                                        onBlur={(value) => {
                                            let temp = form.getFieldValue('accessConfig.productKey')
                                            form.setFieldsValue({
                                                accessConfig: {
                                                    apiEndpoint: `https://iot.${value}.aliyuncs.com`,
                                                    authEndpoint: `https://iot-auth.${value}.aliyuncs.com/auth/bridge`,
                                                    http2Endpoint: `https://${temp}.iot-as-http2.${value}.aliyuncs.com`,
                                                }
                                            })
                                            let params = form.getFieldValue('accessConfig')
                                            getBridge({
                                                regionId: value,
                                                accessSecret: params.accessSecret,
                                                apiEndpoint: params.apiEndpoint,
                                                authEndpoint: params.authEndpoint,
                                                accessKeyId: params.accessKeyId,
                                            })
                                        }}
                                    >
                                    </AutoComplete>
                                )}
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
                                }} />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="accessSecret">
                                {getFieldDecorator('accessConfig.accessSecret', {
                                    initialValue: accessConfig?.accessSecret,
                                    rules: [{ required: true, message: '请输入' }],
                                })(<Input placeholder="请输入" onBlur={(e) => {
                                    let params = form.getFieldValue('accessConfig')
                                    getBridge({
                                        regionId: params.regionId,
                                        accessSecret: e.target.value,
                                        apiEndpoint: params.apiEndpoint,
                                        authEndpoint: params.authEndpoint,
                                        accessKeyId: params.accessKeyId,
                                    })
                                }} />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="ProductKey">
                                {getFieldDecorator('accessConfig.productKey', {
                                    initialValue: accessConfig?.productKey,
                                    rules: [{ required: true, message: '请输入' }],
                                })(
                                    <AutoComplete placeholder="请选择" allowClear>
                                        {productKeyList && productKeyList.map((i: any, index: number) => {
                                            return <AutoComplete.Option key={index} value={i.productKey}>{`${i.productKey}(${i.productName})`}</AutoComplete.Option>
                                        })}
                                    </AutoComplete>
                                    // <Select placeholder="请选择" allowClear>
                                    //     {productKeyList && productKeyList.map((i: any, index: number) => {
                                    //         return <Select.Option key={index} value={i.productKey}>{`${i.productKey}(${i.productName})`}</Select.Option>
                                    //     })}
                                    // </Select>
                                )}
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
                                        <div style={{ width: "90%" }}>
                                            <Row gutter={0} justify="start">
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
                                                    <Form.Item label="ProductKey">
                                                        {getFieldDecorator(`bridgeConfigs[${index}].bridgeProductKey`, {
                                                            initialValue: item.bridgeProductKey || undefined,
                                                            rules: [{ required: true, message: '网桥ProductKey' }],
                                                        })(
                                                            <AutoComplete placeholder="请选择" allowClear
                                                                onBlur={(value: SelectValue) => {
                                                                    let temp = form.getFieldValue('accessConfig.regionId')
                                                                    let bridge = form.getFieldValue('bridgeConfigs')
                                                                    bridge[index].http2Endpoint = `https://${value}.iot-as-http2.${temp}.aliyuncs.com`
                                                                    form.setFieldsValue({
                                                                        bridgeConfigs: bridge
                                                                    })
                                                                    let config = form.getFieldValue('accessConfig')
                                                                    if (config.regionId !== '' && config.apiEndpoint !== '' &&
                                                                        config.authEndpoint !== '' && config.accessKeyId !== '' && config.accessSecret !== '' && value !== '') {
                                                                        apis.aliyun.getDevices({
                                                                            regionId: config.regionId,
                                                                            accessSecret: config.accessSecret,
                                                                            apiEndpoint: config.apiEndpoint,
                                                                            productKey: value,
                                                                            authEndpoint: config.authEndpoint,
                                                                            accessKeyId: config.accessKeyId,
                                                                        }).then(res => {
                                                                            if (res.status === 200) {
                                                                                deviceList[index] = res.result?.data || []
                                                                                setDeviceList([...deviceList])
                                                                            }
                                                                        })
                                                                    }
                                                                }}>
                                                                {productKeyList && productKeyList.map((i: any, index: number) => {
                                                                    return <AutoComplete.Option key={index} value={i.productKey}>{`${i.productKey}(${i.productName})`}</AutoComplete.Option>
                                                                })}
                                                            </AutoComplete>
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item label="DeviceName">
                                                        {getFieldDecorator(`bridgeConfigs[${index}].bridgeDeviceName`, {
                                                            initialValue: item.bridgeDeviceName || undefined,
                                                            rules: [{ required: true, message: '网桥DeviceName' }],
                                                        })(
                                                            <AutoComplete placeholder="网桥DeviceName" allowClear onBlur={(value: SelectValue) => {
                                                                let secret = ''
                                                                if (value !== '' && value !== undefined) {
                                                                    let data: any[] = deviceList[index].filter((i: any) => {
                                                                        return i.deviceName === value
                                                                    })
                                                                    if(data.length > 0){
                                                                        secret = data[0].deviceSecret
                                                                    }
                                                                }
                                                                let bridge = form.getFieldValue('bridgeConfigs')
                                                                bridge[index].bridgeDeviceSecret = secret
                                                                form.setFieldsValue({
                                                                    bridgeConfigs: bridge
                                                                })
                                                            }}>
                                                                {deviceList && deviceList.length > 0 && deviceList[index] && deviceList[index].length > 0 && deviceList[index].map((i: any, index: number) => {
                                                                    return <AutoComplete.Option key={index} value={i.deviceName}>{i.deviceName}</AutoComplete.Option>
                                                                })}
                                                            </AutoComplete>
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item label="DeviceSecret">
                                                        {getFieldDecorator(`bridgeConfigs[${index}].bridgeDeviceSecret`, {
                                                            initialValue: item.bridgeDeviceSecret || undefined,
                                                            rules: [{ required: true, message: '网桥DeviceSecret' }],
                                                        })(
                                                            <Input placeholder="请输入" readOnly />
                                                        )}
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item label="HTTP2接口地址">
                                                        {getFieldDecorator(`bridgeConfigs[${index}].http2Endpoint`, { //https://a1WEHOY5PU7.iot-as-http2.cn-shanghai.aliyuncs.com
                                                            initialValue: item.http2Endpoint || undefined,
                                                            rules: [{ required: true, message: '请输入' }],
                                                        })(<Input placeholder="请输入" />)}
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </div>
                                        <div style={{ width: "10%", display: 'flex', justifyContent: 'center', marginTop: '45px' }}>
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
                                bridgeDeviceSecret: "",
                                http2Endpoint: ""
                            }])
                            setDeviceList([...deviceList, {}])
                        }}
                    >添加</Button>
                </Form>
            </div>
        </Modal>
    )
}

export default Form.create<Props>()(Save);