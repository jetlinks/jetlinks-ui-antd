import { Modal, Button, Divider, Form, Input } from 'antd';

import React, { Fragment, useState, useEffect } from 'react';
import { getWebsocket } from '@/layouts/GlobalWebSocket';

interface Props {
  close: Function;
  item: any;
}
interface State {
  type: string;
  logs: any[];
}
const TcpServer: React.FC<Props> = props => {
  const { item } = props;
  const initState: State = {
    type: 'HEX',
    logs: [],
  };

  const [logs, setLogs] = useState(initState.logs);
  const [responseData, setResponseData] = useState<any>();
  const [subs, setSubs] = useState<any>();

  const closeEventSource = () => {
    if (subs) {
      subs.unsubscribe();
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

    if (subs) {
      subs.unsubscribe()
    }
    const ws = getWebsocket(
      `tcp-server-debug`,
      `/network/tcp/server/${item.id}/_subscribe`,
      {
        response: responseData
      }
    ).subscribe(
      (resp: any) => {
        const { payload } = resp;
        setLogs(l => [...l, JSON.stringify(payload), '\n']);
      }
    );
    setSubs(ws);
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
              if (subs) subs.unsubscribe();
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
        <Form.Item label="响应数据">
          <Input.TextArea
            rows={8}
            placeholder="16进制请使用0x开头"
            onChange={e => {
              setResponseData(e.target.value);
              localStorage.setItem('tcp-server-debug', e.target.value);
            }}
            value={responseData}
          />
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
