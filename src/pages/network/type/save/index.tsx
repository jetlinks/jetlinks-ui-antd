import React from "react";
import { Modal, Form, Input, Drawer, Button } from "antd";

interface Props {
    close: Function
}
interface State {

}
const Save: React.FC<Props> = (props) => {
    return (
        <Drawer
            title="编辑XXXX组件"
            visible
            width='30VW'
        >
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
                <Form.Item label="名称">
                    <Input />
                </Form.Item>
                <Form.Item label="线程数">
                    <Input />
                </Form.Item>
                <Form.Item label="HOST">
                    <Input />
                </Form.Item>
                <Form.Item label="PORT">
                    <Input />
                </Form.Item>
                <Form.Item label="TLS">
                    <Input />
                </Form.Item>
                <Form.Item label="证书">
                    <Input />
                </Form.Item>
                <Form.Item label="说明">
                    <Input />
                </Form.Item>
            </Form>

            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e9e9e9',
                    padding: '10px 16px',
                    background: '#fff',
                    textAlign: 'right',
                }}
            >
                <Button onClick={() => { props.close() }} style={{ marginRight: 8 }}>
                    关闭
                </Button>
                <Button onClick={() => { }} type="primary">
                    保存
                </Button>
            </div>
        </Drawer>
    )
}
export default Save;