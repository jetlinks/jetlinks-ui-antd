import { Modal, Button, Divider, Form, Input, Select, message } from 'antd';

import React, { Fragment, useState } from 'react';
import { getAccessToken } from '@/utils/authority';

interface Props {
  close: Function;
  item: any;
}
interface State {
  type: string;
  logs: string;
}
const WebSocketServer: React.FC<Props> = props => {
  const { item } = props;
  const initState: State = {
    type: 'JSON',
    logs: '',
  };
  const [type, setType] = useState(initState.type);
  const [logs, setLogs] = useState(initState.logs);

  const debug = () => {
    setLogs(`${logs}开始调试\n`);
    const eventSource = new EventSource(
      `/jetlinks/network/websocket/server/${
        item.id
      }/_subscribe/${type}?:X_Access_Token=${getAccessToken()}`,
    );
    eventSource.onerror = () => {
      message.error('调试错误');
    };
    eventSource.onmessage = e => {
      // 追加日志
      message.success(e.data);
    };
    eventSource.onopen = () => {
      setLogs(`${logs}开启推送`);
      message.error('关闭链接');
    };
  };
  return (
    <Modal
      visible
      width={840}
      title="调试WebSocket服务"
      onCancel={() => props.close()}
      footer={
        <Fragment>
          <Button
            type="primary"
            onClick={() => {
              debug();
            }}
          >
            开始
          </Button>
          <Divider type="vertical" />
          <Button
            type="danger"
            onClick={() => {
              setLogs(`${logs}结束调试\n`);
            }}
          >
            结束
          </Button>
          <Divider type="vertical" />
          <Button type="ghost" onClick={() => setLogs('')}>
            清空
          </Button>
        </Fragment>
      }
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item label="数据类型">
          <Select
            defaultValue={type}
            onChange={(e: string) => {
              setType(e);
            }}
          >
            <Select.Option value="JSON">JSON</Select.Option>
            <Select.Option value="BINARY">二进制</Select.Option>
            <Select.Option value="STRING">字符串</Select.Option>
            <Select.Option value="HEX">16进制</Select.Option>
          </Select>
        </Form.Item>
        <Divider>调试日志</Divider>
        <Input.TextArea rows={4} value={logs} placeholder="只会接收最新的客户端链接" />
      </Form>
    </Modal>
  );
};
export default WebSocketServer;
