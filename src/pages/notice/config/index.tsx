import { PageHeaderWrapper } from "@ant-design/pro-layout"
import React from "react"
import { Tabs, Icon, Card, Form, Input, Button, Row, Col, Table, Divider } from "antd";

interface Props {

}
interface State {

}
const Config: React.FC<Props> = (props) => {
    return (
        <PageHeaderWrapper >
            <Card>
                <Tabs defaultActiveKey="1" tabPosition="left" style={{ height: '60VH' }}>
                    <Tabs.TabPane
                        tab={
                            <span>
                                <Icon type="apple" />
                                短信短信短信
                         </span>
                        }
                        key="1"
                    >
                        <Row>
                            <Col span={8}>
                                <Form.Item label="配置名称" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Button type="primary" style={{ marginTop: 2, marginRight: 10 }}>查询</Button>
                                <Button style={{ marginTop: 2, marginRight: 10 }}>重置</Button>

                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 15 }}>
                            <Button type="primary" style={{ marginTop: 2, marginRight: 10 }}>新建</Button>
                            <Button style={{ marginTop: 2, marginRight: 10 }}>批量导出</Button>
                            <Button style={{ marginTop: 2, marginRight: 10 }}>导入配置</Button>
                        </Row>
                        <Table
                            columns={[
                                {
                                    dataIndex: 'id',
                                    title: 'ID',
                                },
                                {
                                    dataIndex: 'name',
                                    title: '配置名称',
                                },
                                {
                                    dataIndex: 'type',
                                    title: '通知类型',
                                },
                                {
                                    dataIndex: 'provider',
                                    title: '服务商',
                                },
                                {
                                    dataIndex: 'option',
                                    title: '操作',
                                },

                            ]}
                            dataSource={[]}
                        />

                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={
                            <span>
                                <Icon type="android" />
                                语音
                            </span>
                        }
                        key="2"
                    >
                        <Row>
                            <Col span={8}>
                                <Form.Item label="配置名称" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Button type="primary" style={{ marginTop: 2, marginRight: 10 }}>查询</Button>
                                <Button style={{ marginTop: 2, marginRight: 10 }}>重置</Button>

                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 15 }}>
                            <Button type="primary" style={{ marginTop: 2, marginRight: 10 }}>新建</Button>
                            <Button style={{ marginTop: 2, marginRight: 10 }}>批量导出</Button>
                            <Button style={{ marginTop: 2, marginRight: 10 }}>导入配置</Button>
                        </Row>
                        <Table
                            columns={[
                                {
                                    dataIndex: 'id',
                                    title: 'ID',
                                },
                                {
                                    dataIndex: 'name',
                                    title: '配置名称',
                                },
                                {
                                    dataIndex: 'type',
                                    title: '通知类型',
                                },
                                {
                                    dataIndex: 'provider',
                                    title: '服务商',
                                },
                                {
                                    dataIndex: 'option',
                                    title: '操作',
                                },

                            ]}
                            dataSource={[]}
                        />

                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={
                            <span>
                                <Icon type="android" />
                                钉钉
                            </span>
                        }
                        key="3"
                    >
                        <Row>
                            <Col span={8}>
                                <Form.Item label="配置名称" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Button type="primary" style={{ marginTop: 2, marginRight: 10 }}>查询</Button>
                                <Button style={{ marginTop: 2, marginRight: 10 }}>重置</Button>

                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 15 }}>
                            <Button type="primary" style={{ marginTop: 2, marginRight: 10 }}>新建</Button>
                            <Button style={{ marginTop: 2, marginRight: 10 }}>批量导出</Button>
                            <Button style={{ marginTop: 2, marginRight: 10 }}>导入配置</Button>
                        </Row>
                        <Table
                            columns={[
                                {
                                    dataIndex: 'id',
                                    title: 'ID',
                                },
                                {
                                    dataIndex: 'name',
                                    title: '配置名称',
                                },
                                {
                                    dataIndex: 'type',
                                    title: '通知类型',
                                },
                                {
                                    dataIndex: 'provider',
                                    title: '服务商',
                                },
                                {
                                    dataIndex: 'option',
                                    title: '操作',
                                },

                            ]}
                            dataSource={[]}
                        />

                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={
                            <span>
                                <Icon type="android" />
                                邮件
                            </span>
                        }
                        key="4"
                    >
                        <Row>
                            <Col span={8}>
                                <Form.Item label="配置名称" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Button type="primary" style={{ marginTop: 2, marginRight: 10 }}>查询</Button>
                                <Button style={{ marginTop: 2, marginRight: 10 }}>重置</Button>

                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 15 }}>
                            <Button type="primary" style={{ marginTop: 2, marginRight: 10 }}>新建</Button>
                            <Button style={{ marginTop: 2, marginRight: 10 }}>批量导出</Button>
                            <Button style={{ marginTop: 2, marginRight: 10 }}>导入配置</Button>
                        </Row>
                        <Table
                            columns={[
                                {
                                    dataIndex: 'id',
                                    title: 'ID',
                                },
                                {
                                    dataIndex: 'name',
                                    title: '配置名称',
                                },
                                {
                                    dataIndex: 'type',
                                    title: '通知类型',
                                },
                                {
                                    dataIndex: 'provider',
                                    title: '服务商',
                                },
                                {
                                    dataIndex: 'option',
                                    title: '操作',
                                },

                            ]}
                            dataSource={[]}
                        />

                    </Tabs.TabPane>
                    <Tabs.TabPane
                        tab={
                            <span>
                                <Icon type="android" />
                                微信
                            </span>
                        }
                        key="5"
                    >
                        <Row>
                            <Col span={8}>
                                <Form.Item label="配置名称" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }} >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Button type="primary" style={{ marginTop: 2, marginRight: 10 }}>查询</Button>
                                <Button style={{ marginTop: 2, marginRight: 10 }}>重置</Button>

                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 15 }}>
                            <Button type="primary" style={{ marginTop: 2, marginRight: 10 }}>新建</Button>
                            <Button style={{ marginTop: 2, marginRight: 10 }}>批量导出</Button>
                            <Button style={{ marginTop: 2, marginRight: 10 }}>导入配置</Button>
                        </Row>
                        <Table
                            columns={[
                                {
                                    dataIndex: 'id',
                                    title: 'ID',
                                },
                                {
                                    dataIndex: 'name',
                                    title: '配置名称',
                                },
                                {
                                    dataIndex: 'type',
                                    title: '通知类型',
                                },
                                {
                                    dataIndex: 'provider',
                                    title: '服务商',
                                },
                                {
                                    dataIndex: 'option',
                                    title: '操作',
                                },

                            ]}
                            dataSource={[]}
                        />

                    </Tabs.TabPane>
                </Tabs>
            </Card>
        </PageHeaderWrapper>
    )
}
export default Config;