import { Modal, Button, Divider, Form, Select, message } from 'antd';

import React, { Fragment, useState, useEffect } from 'react';
import { getAccessToken } from '@/utils/authority';
import { wrapAPI } from '@/utils/utils';

interface Props {
  close: Function;
  item: any;
}
interface State {
  type: string;
  logs: any[];
}
const TcpServer: React.FC<Props> = props => {
  let eventSource: EventSource | null;
  const { item } = props;
  const initState: State = {
    type: 'HEX',
    logs: [],
  };

  const [type, setType] = useState(initState.type);
  const [logs, setLogs] = useState(initState.logs);
  const [sourceState, setSourceState] = useState<any>();

  const closeEventSource = () => {
    if (eventSource) {
      eventSource.close();
      message.success('关闭链接');
    }
  };

  useEffect(
    () => () => {
      closeEventSource();
    },
    [],
  );

  const debug = () => {
    logs.push('开始调试');
    setLogs([...logs]);
    // setClear(false);
    if (eventSource) {
      eventSource.close();
    }
    eventSource = new EventSource(
      wrapAPI(
        `/jetlinks/network/tcp/server/${
          item.id
        }/_subscribe/${type}?:X_Access_Token=${getAccessToken()}`,
      ),
    );
    setSourceState(eventSource);
    eventSource.onerror = () => {
      setLogs([...logs, '断开连接']);
    };

    eventSource.onmessage = e => {
      setLogs(l => [...l, e.data]);
    };

    eventSource.onopen = () => {
      // tempLogs += '开启推送\n';
      // setLogs(tempLogs);
    };
  };

  const clearLog = () => {
    logs.splice(0, logs.length);
    setLogs([]);
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
              logs.push('结束调试');
              setLogs([...logs]);
              if (sourceState) sourceState.close();
            }}
          >
            结束
          </Button>
          <Divider type="vertical" />
          <Button type="ghost" onClick={clearLog}>
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
        <div style={{ height: 350, overflow: 'auto' }}>
          <pre>{logs.join('\n')}</pre>
        </div>
      </Form>
    </Modal>
  );
};
export default TcpServer;
