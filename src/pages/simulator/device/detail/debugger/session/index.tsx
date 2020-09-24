import { getWebsocket } from "@/layouts/GlobalWebSocket";
import { Input, Divider, Button, Row, Col, message } from "antd";
import React, { useEffect, useState } from "react";
import Service from "../../../service";

interface Props {
    data: any;
    item: any
}
const Session: React.FC<Props> = props => {
    const { data, item } = props;
    const [subMsg, setSubMsg] = useState<any>('');
    const service = new Service('network/simulator');

    const [msg, setMsg] = useState<string>('');
    useEffect(() => {
        console.log(`获取${item.id},${data.id}消息`);
        let simulator = getWebsocket(
            `network-simulator-session`,
            `/network/simulator/${data.id}/${item.id}`,
            {},
        ).subscribe(
            (resp: any) => {
                setSubMsg(resp);
            },
        );
        return () => {
            console.log('取消订阅,' + item.id);
            simulator.unsubscribe();
        }
    }, [item]);
    const sendMsg = (msg: string) => {
        service.sendMessage(data.id, item.id, msg).subscribe(
            () => {
                message.success('发送成功!')
            },
            () => message.error('保存失败!'))
    }

    return (
        <div>
            <Input.TextArea rows={17} value={subMsg.payload} />
            <Divider />
            <Row gutter={10}>
                <Col span={20}>
                    <Input.TextArea rows={3} onChange={e => setMsg(e.target.value)} />
                </Col>
                <Col span={3}>
                    <Button
                        onClick={() => { sendMsg(msg) }}
                        style={{ width: 100, height: 75 }}
                        type="primary">发送</Button>
                </Col>
            </Row>
        </div>
    )
}
export default Session;