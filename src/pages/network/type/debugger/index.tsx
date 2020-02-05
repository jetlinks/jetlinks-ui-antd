import React from 'react';
import { Modal, Row, Form, Input, Select, Tabs } from 'antd';

interface Props {
  close: Function;
}
interface State {}

const Debugger: React.FC<Props> = props => {
  const sendMessage = () => {};
  return (
    <Modal
      visible
      width={840}
      title="调试MQTT客户端"
      onCancel={() => props.close()}
      onOk={() => sendMessage()}
    >
      <Row>
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
          <Tabs>
            <Tabs.TabPane tab="订阅消息" key="subscribe">
              <Form.Item label="订阅Topic">
                <Input.TextArea rows={2} />
              </Form.Item>
              <Form.Item label="数据类型">
                <Select>
                  <Select.Option value="JSON">JSON</Select.Option>
                  <Select.Option value="BINARY">二进制</Select.Option>
                  <Select.Option value="STRING">字符串</Select.Option>
                  <Select.Option value="HEX">16进制</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="接收消息">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Tabs.TabPane>
            <Tabs.TabPane tab="推送消息" key="publish">
              <Form.Item label="推送Topic">
                <Input.TextArea rows={2} />
              </Form.Item>
              <Form.Item label="数据类型">
                <Select>
                  <Select.Option value="JSON">JSON</Select.Option>
                  <Select.Option value="BINARY">二进制</Select.Option>
                  <Select.Option value="STRING">字符串</Select.Option>
                  <Select.Option value="HEX">16进制</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="推送数据">
                <Input.TextArea rows={4} />
              </Form.Item>
            </Tabs.TabPane>
          </Tabs>
        </Form>
      </Row>
    </Modal>
  );
};
export default Debugger;
