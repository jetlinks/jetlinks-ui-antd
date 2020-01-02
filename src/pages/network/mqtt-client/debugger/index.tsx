import React from "react"
import { Modal, Row, Col, Button, Divider, Form, Input, Select, Tabs } from "antd"

interface Props {
    close: Function
}
const Debugger: React.FC<Props> = (props) => {

    return (
        <Modal
            visible
            onCancel={() => props.close()}
            width={900}
            title="调试"
        >
            <Row style={{ marginBottom: 10 }}>
                <Col span={11}>
                    <h3>客户端名称:测试MQTT客户端</h3>
                </Col>
                <Col span={8}>
                    <h3>状态:活跃的</h3>
                </Col>
                <Col span={5}>
                    <Button type="primary">
                        刷新状态
                    </Button>
                    <Divider type="vertical" />
                    <Button type="danger">
                        停止
                    </Button>
                </Col>
            </Row>
            <Tabs>
                <Tabs.TabPane tab="订阅消息" key="subscribe">
                    <Form.Item label="订阅Topic">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="订阅数据类型">
                        <Select style={{ width: "100%" }}>
                            <Select.Option value="JSON">JSON</Select.Option>
                            <Select.Option value="STRING">字符串</Select.Option>
                            <Select.Option value="BINARY">二进制</Select.Option>
                            <Select.Option value="HEX">16进制字符</Select.Option>
                        </Select>
                    </Form.Item>
                    <Row>
                        <Col push={20}>
                            <Button type="primary">提交</Button>
                            <Divider type="vertical" />
                            <Button type="default">清空</Button>
                        </Col>
                    </Row>
                    <Form.Item label="接收消息">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Tabs.TabPane>
                <Tabs.TabPane tab="接收消息" key="push">
                    <Form.Item label="推送Topic">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item label="推送数据类型">
                        <Select style={{ width: "100%" }}>
                            <Select.Option value="JSON">JSON</Select.Option>
                            <Select.Option value="STRING">字符串</Select.Option>
                            <Select.Option value="BINARY">二进制</Select.Option>
                            <Select.Option value="HEX">16进制字符</Select.Option>
                        </Select>
                    </Form.Item>
                    <Row>
                        <Col push={20}>
                            <Button type="primary">提交</Button>
                            <Divider type="vertical" />
                            <Button type="default">清空</Button>
                        </Col>
                    </Row>
                    <Form.Item label="推送数据">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Tabs.TabPane>
            </Tabs>
        </Modal>
    )
}

export default Debugger;