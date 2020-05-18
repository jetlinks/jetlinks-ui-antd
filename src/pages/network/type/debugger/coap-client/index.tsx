import { Modal, Button, Divider, Form, Input } from 'antd';
import React, { Fragment, useState } from 'react';
import { getWebsocket } from '@/layouts/GlobalWebSocket';

interface Props {
  close: Function;
  item: any;
}
interface State {
  debugData: {
    url: string;
    options: string;
    method: string;
    payload: string;
    payloadType: string;
  };
  logs: string[];
}

const CoapClient: React.FC<Props> = props => {
  const { item } = props;
  const initState: State = {
    debugData: {
      url: '',
      options: '',
      method: '',
      payload: '',
      payloadType: 'JSON',
    },
    logs: [],
  };

  const [debugData, setDebugData] = useState<string>(localStorage.getItem('coap-client-debug-data') || 'GET coap://host:port/uri\nContent-Format: application/json\n\n{}');
  const [logs, setLogs] = useState(initState.logs);
  const [subs, setSubs] = useState<any>();

  const debugMqttClient = () => {
    logs.push('开始调试');
    setLogs([...logs]);

    if (subs) {
      subs.unsubscribe()
    }
    const ws = getWebsocket(
      `coap-client-debug`,
      `/network/coap/client/${item.id}/_send`,
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
      title="调试COAP客户端"
      onCancel={() => props.close()}
      footer={
        <Fragment>
          <Button
            type="primary"
            onClick={() => {
              debugMqttClient();
            }}
          >
            提交
          </Button>
          <Divider type="vertical" />
          <Button type="ghost" onClick={() => setLogs([])}>
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
              localStorage.setItem('coap-client-debug-data', e.target.value);
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

export default CoapClient;
