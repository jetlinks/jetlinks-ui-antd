import React, { useState, useEffect } from "react";
import Form, { FormComponentProps } from "antd/lib/form";
import { FormItemConfig } from "@/utils/common";
import { Input, Select, Row, Col, Button, Icon } from "antd";
import apis from "@/services";

interface Props extends FormComponentProps {
    search: Function;
}

interface State {
    expandForm: boolean;
    protocolSupports: any[];
}

const Search: React.FC<Props> = (props) => {

    const initState: State = {
        expandForm: true,
        protocolSupports: [],
    }

    //消息协议
    const [protocolSupports, setProtocolSupports] = useState(initState.protocolSupports);
    const { form, form: { getFieldDecorator } } = props;

    const [expandForm, setExpandForm] = useState(initState.expandForm);


    useEffect(() => {
        apis.deviceProdcut.protocolSupport().then(response => {
            if (response.status === 200) {
                setProtocolSupports(response.result);
            }
        });
    }, []);

    const simpleItems: FormItemConfig[] = [
        {
            label: "型号名称",
            key: "name$LIKE",
            component: <Input placeholder="请输入" />,
        },
        {
            label: "设备类型",
            key: "deviceType$LIKE",
            component:
                <Select placeholder="请选择">
                    <Select.Option value="gateway">网关</Select.Option>
                    <Select.Option value="device">设备</Select.Option>
                </Select>,
        },
    ];

    const advancedItems: FormItemConfig[] = [
        {
            label: "型号名称",
            key: "name$LIKE",
            component: <Input placeholder="请输入" />,
        },
        {
            label: "设备类型",
            key: "deviceType",
            component:
                <Select placeholder="请选择">
                    <Select.Option value="gateway">网关</Select.Option>
                    <Select.Option value="device">设备</Select.Option>
                </Select>,
        },
        {
            label: "消息协议",
            key: "messageProtocol",
            component:
                <Select placeholder="请选择">
                    {
                        protocolSupports.map(e => <Select.Option value={e.id} key={e.id}>{e.name}</Select.Option>)
                    }
                </Select>,
        },
        {
            label: "链接协议",
            key: "transportProtocol",
            component:
                <Select placeholder="请选择">
                    <Select.Option value="MQTT">MQTT</Select.Option>
                    <Select.Option value="UDP">UDP</Select.Option>
                    <Select.Option value="DCP">DCP</Select.Option>
                </Select>,
        },
    ];

    const colSize = (expandForm ? simpleItems : advancedItems)
        .map(item => item.styles ? item.styles.md : 8)
        .reduce((i, j) => {
            if (!i) return;
            if (!j) return;
            return Number(i) + Number(j);
        }) || 1;


    const search = () => {
        const data = form.getFieldsValue();
        //TODO 查询数据
        props.search(data);
    }

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 }
        },
    };
    return (
        <Form {...formItemLayout}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                {expandForm ? (
                    simpleItems.map(item => (
                        <Col md={8} sm={24} key={item.key}>
                            <Form.Item label={item.label}>
                                {getFieldDecorator(item.key)(item.component)}
                            </Form.Item>
                        </Col>
                    ))) : (
                        advancedItems.map((item) => (
                            <Col md={item.styles ? item.styles.md : 8} sm={item.styles ? item.styles.sm : 24} key={item.key} style={{ height: 56 }}>
                                <Form.Item label={item.label}>
                                    {getFieldDecorator(item.key, item.options)(item.component)}
                                </Form.Item>
                            </Col>
                        )))
                }

                <Col push={16 - (Number(colSize) % 24)} md={8} sm={24}>
                    <div style={{ float: 'right', marginBottom: 24 }}>
                        <Button type="primary" onClick={() => { search() }}>
                            查询
                        </Button>
                        <Button style={{ marginLeft: 8 }} onClick={() => { form.resetFields(); props.search() }}>
                            重置
                        </Button>
                        <a style={{ marginLeft: 8 }} onClick={() => setExpandForm(!expandForm)}>
                            {expandForm ? "展开" : "收起"} <Icon type={expandForm ? 'down' : 'up'} />
                        </a>
                    </div>
                </Col>
            </Row>
        </Form >
    );
}

export default Form.create<Props>()(Search);
