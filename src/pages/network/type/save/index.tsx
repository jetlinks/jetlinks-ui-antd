import React from "react";
import { Modal, Form, Input } from "antd";

interface Props {

}
interface State {

}
const Save: React.FC<Props> = (props) => {
    return (
        <Modal title="编辑XXXX组件" visible>
            <Form layout="horizontal">
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
        </Modal>
    )
}
export default Save;