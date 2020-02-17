import { Modal, Button, Divider, Form, Input, Select } from 'antd';

import React, { Fragment, useState, useEffect } from 'react';
import { getAccessToken } from '@/utils/authority';
import { wrapAPI } from '@/utils/utils';

interface Props {
  close: Function;
  item: any;
}
interface State {
  type: string;
  logs: string;
}
const TcpServer: React.FC<Props> = props => {

  let eventSource: EventSource | null = null;
  const { item } = props;
  const initState: State = {
    type: 'JSON',
    logs: '',
  };
  const [type, setType] = useState(initState.type);
  const [logs, setLogs] = useState(initState.logs);

  useEffect(() => () => {
    if (eventSource) {
      eventSource.close();
    }
  }, [])

  let tempLogs: string = '';

  const debug = () => {
    setLogs(`${logs}开始调试\n`);
    if (eventSource) {
      eventSource.close();
    }
    tempLogs += '开始调试\n';
    eventSource = new EventSource(wrapAPI(`/jetlinks/network/tcp/server/${item.id}/_subscribe/${type}?:X_Access_Token=${getAccessToken()}`));

    eventSource.onerror = () => {
      tempLogs += '调试断开\n';
      setLogs(tempLogs);
    };

    eventSource.onmessage = e => {
      // 追加日志
      tempLogs += `${e.data}\n`;
      setLogs(tempLogs);
    };

    eventSource.onopen = () => {
      tempLogs += '开启推送\n';
      setLogs(tempLogs);
    };
  };
  return (
    <Modal
      visible
      width={840}
      title="调试TCP服务"
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
export default TcpServer;
