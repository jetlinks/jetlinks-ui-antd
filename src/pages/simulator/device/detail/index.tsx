import { Card, Col, Modal, Row, Tabs } from "antd"
import React, { useEffect, useState } from "react"
import Service from "../service";
import Message from "./message";
import Time from "./time";
import Error from "./error";
import Debugger from "./debugger";
interface Props {
    close: Function
    data: any
}
const Detail: React.FC<Props> = props => {
    const service = new Service('network/simulator');

    const [data, setData] = useState<any>({});
    useEffect(() => {
        service.state(props.data.id).pipe(
        ).subscribe(data => {
            setData(data);
        });
    }, []);
    return (
        <Modal
            title="详情"
            visible
            width={1000}
            onCancel={() => props.close()}
            onOk={() => props.close()}
            footer={null}
        >
            <Tabs>
                <Tabs.TabPane key="basic" tab="基础信息">
                    <Row gutter={16}>
                        <Col span={6}>
                            <Card>
                                <div>成功连接数</div>
                                <div>{data?.total}</div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <div>失败连接数</div>
                                <div>{data?.failed}</div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <div>并发数量</div>
                                <div>{data?.current}</div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <div>时间统计</div>
                                <div>平均{data?.aggTime?.avg}s</div>
                            </Card>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 20 }} gutter={16}>
                        <Col span={12}>
                            <Time time={data?.distTime} />
                        </Col>
                        <Col span={12}>
                            <Error failed={data?.failed} failedTypeCounts={data?.failedTypeCounts} />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 20 }}>
                        <Message runtimeHistory={data?.runtimeHistory} />
                    </Row>
                </Tabs.TabPane>
                <Tabs.TabPane key="debug" tab="设备调试">
                    <Debugger data={props.data} />
                </Tabs.TabPane>
            </Tabs>
        </Modal>
    )
}
export default Detail;