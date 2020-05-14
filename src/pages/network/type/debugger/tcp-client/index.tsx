import { Modal, Button, Divider, Tabs, Form, Input } from 'antd';
import React, { Fragment, useState, useEffect } from 'react';
import { getWebsocket } from '@/layouts/GlobalWebSocket';

interface Props {
  close: Function;
  item: any;
}
interface State {
  action: string;
  subscribeData: {
    topics: string;
    type: string;
  };
  publishData: {
    type: string;
    data: string;
  };
  logs: any[];
}

const TcpClient: React.FC<Props> = props => {

  const { item } = props;
  const initState: State = {
    action: '_subscribe',
    subscribeData: {
      topics: '',
      type: 'JSON',
    },
    publishData: {
      type: 'JSON',
      data: '',
    },
    logs: [],
  };

  const [action, setAction] = useState(initState.action);
  const [logs, setLogs] = useState(initState.logs);
  const [sendLogs, setSendLogs] = useState<any[]>([]);

  const [requestData, setRequestData] = useState<any>();
  const [responseData, setResponseData] = useState<any>();
  const [subs, setSubs] = useState<any>();

  const [sends, setSends] = useState<any>();
  const debugMqttClient = () => {

    if (action === '_subscribe') {
      logs.push('开始调试');
      setLogs([...logs]);
      if (subs) {
        subs.unsubscribe()
      }
      const ws = getWebsocket(
        `tcp-client-debug-subscribe`,
        `/network/tcp/client/${item.id}/_subscribe`,
        {
          response: responseData
        }
      ).subscribe(
        (resp: any) => {
          const { payload } = resp;
          setLogs(l => [...l, payload, '\n']);
        }
      );
      setSubs(ws);
    } else if (action === '_publish') {
      if (sends) {
        sends.unsubscribe()
      }
      const ws = getWebsocket(
        `tcp-client-debug-send`,
        `/network/tcp/client/${item.id}/_send`,
        {
          request: requestData
        }
      ).subscribe(
        (resp: any) => {
          const { payload } = resp;
          setSendLogs(l => [...l, payload, '\n']);
        }
      );
      setSends(ws);
    }
  };

  useEffect(
    () => () => {
      if (subs) {
        subs.unsubscribe()
      }
      if (sends) {
        sends.unsubscribe()
      }
    },
    [],
  );

  return (
    <Modal
      visible
      width={840}
      title="调试TCP客户端"
      onCancel={() => props.close()}
      footer={
        action === '_subscribe' ? (
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
            <Button
              type="danger"
              onClick={() => {
                logs.push('结束调试');
                setLogs([...logs]);
                if (subs) {
                  subs.unsubscribe()
                }
                if (sends) {
                  sends.unsubscribe()
                }
              }}
            >
              关闭
            </Button>
            <Divider type="vertical" />
            <Button
              type="ghost"
              onClick={() => {
                logs.splice(0, logs.length);
                setLogs([]);
                setSendLogs([]);
              }}
            >
              清空
            </Button>
          </Fragment>
        ) : (
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
          )
      }
    >
      <Tabs defaultActiveKey={action} onChange={e => setAction(e)}>
        <Tabs.TabPane tab="订阅消息" key="_subscribe">
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Form.Item label="响应数据">
              <Input.TextArea
                rows={8}
                placeholder="16进制请使用0x开头"
                onChange={e => {
                  setResponseData(e.target.value);
                  localStorage.setItem('tcp-client-debug-response', e.target.value);
                }}
                value={responseData}
              />
            </Form.Item>
            <Divider>调试日志</Divider>
            <div style={{ height: 350, overflow: 'auto' }}>
              <pre>{logs.join('\n')}</pre>
            </div>
          </Form>
        </Tabs.TabPane>

        <Tabs.TabPane tab="推送消息" key="_publish">
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Form.Item label="请求数据">
              <Input.TextArea
                rows={8}
                placeholder="16进制请使用0x开头"
                onChange={e => {
                  setRequestData(e.target.value);
                  localStorage.setItem('tcp-client-debug-request', e.target.value);
                }}
                value={requestData}
              />
            </Form.Item>
            <Divider>调试日志</Divider>
            <div style={{ height: 350, overflow: 'auto' }}>
              <pre>{sendLogs.join('\n')}</pre>
            </div>
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default TcpClient;
