import { Modal, Button, Divider, Form, Input, Select, Card, Row, Col, Icon } from 'antd';

import React, { Fragment, useState } from 'react';
import { getAccessToken } from '@/utils/authority';
import { randomString, wrapAPI } from '@/utils/utils';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { getWebsocket } from '@/layouts/GlobalWebSocket';

interface Props {
  close: Function;
  item: any;
}
interface State {
  type: string;
  logs: string[];
  debugData: {
    status: string;
    payload: string;
    headers: {
      id: string;
      name: string;
      value: string[];
      describe: string;
    }[];
    contentType: string;
  };
}
const HttpServer: React.FC<Props> = props => {
  const { item } = props;
  const initState: State = {
    type: 'JSON',
    logs: [],
    debugData: {
      status: '200',
      payload: '',
      headers: [
        {
          id: randomString(8),
          name: '',
          value: [],
          describe: '',
        },
      ],
      contentType: 'application/json',
    },
  };
  const [type, setType] = useState(initState.type);
  const [logs, setLogs] = useState(initState.logs);
  const [debugData, setDebugData] = useState<string>(localStorage.getItem('http-server-debug-data') || 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"success":true}');
  const [sourceState, setSourceState] = useState<any>();

  const [subs, setSubs] = useState<any>();
  const debug = () => {
    logs.push('开始订阅');
    setLogs([...logs]);

    if (subs) {
      subs.unsubscribe()
    }
    const ws = getWebsocket(
      `http-server-debug`,
      `/network/http/server/${item.id}/_subscribe`,
      {
        response: debugData
      }
    ).subscribe(
      (resp: any) => {
        const { payload } = resp;
        setLogs(l => [...l, payload, '\n']);
      }
    );

    setSubs(ws);

  };
  return (
    <Modal
      visible
      width={840}
      title="调试HTTP服务"
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
          <Button
            type="ghost"
            onClick={() => {
              logs.splice(0, logs.length);
              setLogs([]);
            }}
          >
            清空
          </Button>
        </Fragment>
      }
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>

        <Form.Item label="响应数据">
          <Input.TextArea
            rows={8}
            onChange={e => {
              setDebugData(e.target.value);
              localStorage.setItem('http-server-debug-data', e.target.value);
            }}
            value={debugData}

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
export default HttpServer;
