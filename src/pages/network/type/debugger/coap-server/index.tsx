import { Modal, Button, Divider, Form, Input } from 'antd';

import React, { Fragment, useState } from 'react';
import { getWebsocket } from '@/layouts/GlobalWebSocket';

interface Props {
  close: Function;
  item: any;
}

interface State {
  logs: any[];
  debugData: {
    options: string;
    payload: string;
    code: string;
    payloadType: string;
  };
}
const CoapServer: React.FC<Props> = props => {
  const { item } = props;
  const initState: State = {
    logs: [],
    debugData: {
      options: '',
      payload: '',
      code: 'CONTENT',
      payloadType: 'JSON',
    },
  };
  const [logs, setLogs] = useState(initState.logs);
  const [debugData, setDebugData] = useState<string>(localStorage.getItem('coap-server-debug-data') || 'CREATE 2.02\nContent-Format: application/json\n\n{"success":true}');
  const [subs, setSubs] = useState<any>();

  const debug = () => {
    logs.push('开始调试');
    setLogs([...logs]);

    if (subs) {
      subs.unsubscribe()
    }
    const ws = getWebsocket(
      `coap-server-debug`,
      `/network/coap/server/${item.id}/_subscribe`,
      {
        request: debugData
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
      title="调试COAP服务"
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
        <Form.Item label="CoAP请求">
          <Input.TextArea
            rows={8}
            onChange={e => {
              setDebugData(e.target.value);
              localStorage.setItem('coap-server-debug-data', e.target.value);
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
export default CoapServer;
