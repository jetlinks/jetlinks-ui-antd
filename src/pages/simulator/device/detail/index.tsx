import { Card, Col, Modal, Row, Tabs } from "antd"
import React, { useEffect } from "react"
import Service from "../service";
import Message from "./message";
import Time from "./time";
import Error from "./error";
interface Props {
    close: Function
    data: any
}
const Detail: React.FC<Props> = props => {
    const service = new Service('network/simulator');

    useEffect(() => {
        service.state(props.data.id).subscribe(data => {
            console.log(data, 'dddd');
        })
    }, []);
    return (
        <Modal
            title="详情"
            visible
            width={1000}
            onCancel={() => props.close()}
            onOk={() => props.close()}
        >
            <Tabs>
                <Tabs.TabPane key="basic" tab="基础信息">
                    <Row gutter={16}>
                        <Col span={6}>
                            <Card>
                                <div>成功连接数</div>
                                <div>1233</div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <div>成功连接数</div>
                                <div>1233</div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <div>成功连接数</div>
                                <div>1233</div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <div>成功连接数</div>
                                <div>1233</div>
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 20 }} gutter={16}>
                        <Col span={12}>
                            <Time />
                        </Col>
                        <Col span={12}>
                            <Error />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 20 }}>
                        <Message />
                    </Row>
                </Tabs.TabPane>
                <Tabs.TabPane key="debug" tab="设备调试">

                </Tabs.TabPane>
            </Tabs>
        </Modal>
    )
}
export default Detail;