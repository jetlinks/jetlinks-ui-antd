import React, { Fragment } from 'react';
import { Modal, Form, Input, Select, Tabs, Button, Divider } from 'antd';
import MqttClient from './mqtt-client';

interface Props {
  close: Function;
  item: any;
}
interface State {}

const Debugger: React.FC<Props> = props => {
  const {
    // item,
    item: {
      type: { text, value },
    },
  } = props;

  const renderContent = () => {
    switch (value) {
      case 'MQTT_CLIENT':
        // console.log('clienet');
        return <MqttClient item={{}} close={() => {}} />;
      case 'MQTT_SERVER':
        return (
          <Modal
            visible
            width={840}
            title={`调试${text}`}
            onCancel={() => props.close()}
            // onOk={() => sendMessage()}
            footer={
              <Fragment>
                <Button type="primary">开始</Button>
                <Divider type="vertical" />
                <Button type="danger">结束</Button>
                <Divider type="vertical" />
                <Button type="ghost">清空</Button>
              </Fragment>
            }
          >
            <Form labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
              <Form.Item label="数据类型">
                <Select>
                  <Select.Option value="JSON">JSON</Select.Option>
                  <Select.Option value="BINARY">二进制</Select.Option>
                  <Select.Option value="STRING">字符串</Select.Option>
                  <Select.Option value="HEX">16进制</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="接收消息">
                <Input.TextArea rows={4} placeholder="只会接收最新的客户端链接" />
              </Form.Item>
            </Form>
          </Modal>
        );
      case 'TCP_SERVER':
        return (
          <Modal
            visible
            width={840}
            title={`调试${text}`}
            onCancel={() => props.close()}
            // onOk={() => sendMessage()}
            footer={
              <Fragment>
                <Button type="primary">开始</Button>
                <Divider type="vertical" />
                <Button type="danger">结束</Button>
                <Divider type="vertical" />
                <Button type="ghost">清空</Button>
              </Fragment>
            }
          >
            <Form labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
              <Form.Item label="数据类型">
                <Select>
                  <Select.Option value="JSON">JSON</Select.Option>
                  <Select.Option value="BINARY">二进制</Select.Option>
                  <Select.Option value="STRING">字符串</Select.Option>
                  <Select.Option value="HEX">16进制</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="接收消息">
                <Input.TextArea rows={4} placeholder="只会接收最新的客户端链接" />
              </Form.Item>
            </Form>
          </Modal>
        );
      case 'TCP_CLIENT':
        return (
          <Modal
            visible
            width={840}
            title={`调试${text}`}
            onCancel={() => props.close()}
            // onOk={() => sendMessage()}
            footer={
              <Fragment>
                <Button type="primary">提交</Button>
              </Fragment>
            }
          >
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
              <Tabs>
                <Tabs.TabPane tab="订阅消息" key="subscribe">
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
          </Modal>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible
      width={840}
      title={`调试${text}`}
      onCancel={() => props.close()}
      footer={
        <Fragment>
          <Button
            type="primary"
            onClick={() => {
              // debugMqttClient()
            }}
          >
            发送
          </Button>
          <Divider type="vertical" />
          <Button type="ghost">清空</Button>
        </Fragment>
      }
    >
      {renderContent()}
    </Modal>
  );
};
export default Debugger;
