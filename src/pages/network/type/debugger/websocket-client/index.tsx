import { Modal, Button, Divider, Tabs, Form, Input, Select, message } from 'antd';
import React, { Fragment, useState } from 'react';
import { getAccessToken } from '@/utils/authority';
import apis from '@/services';
import { wrapAPI } from '@/utils/utils';
import { EventSourcePolyfill } from 'event-source-polyfill';

interface Props {
  close: Function;
  item: any;
}
interface State {
  action: string;
  subscribeData: {
    type: string;
  };
  publishData: {
    type: string;
    data: string;
  };
  logs: any[];
}

const WebSocketClient: React.FC<Props> = props => {
  const { item } = props;
  const initState: State = {
    action: '_subscribe',
    subscribeData: {
      type: 'JSON',
    },
    publishData: {
      type: 'JSON',
      data: '',
    },
    logs: [],
  };

  const [action, setAction] = useState(initState.action);
  const [subscribeData, setSubscribeData] = useState(initState.subscribeData);
  const [publishData, setPublishData] = useState(initState.publishData);
  const [logs, setLogs] = useState(initState.logs);
  const [sourceState, setSourceState] = useState<any>();

  // const { item: { type: { text } } } = props;
  const debugMqttClient = () => {
    logs.push('开始调试');
    if (action === '_subscribe') {
      // console.log('debugMqtt', data);
      const eventSource = new EventSourcePolyfill(
        wrapAPI(
          `/jetlinks/network/websocket/client/${item.id}/_subscribe/${
          subscribeData.type
          }/?:X_Access_Token=${getAccessToken()}`,
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
        // console.log('opne');
      };
    } else if (action === '_publish') {
      apis.network
        .debugWebSocketClient(item.id, publishData.type, publishData.data)
        .then(response => {
          if (response) {
            message.success('推送成功');
          }
        })
        .catch(() => { });
    }
  };

  return (
    <Modal
      visible
      width={840}
      title="调试WebSocket客户端"
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
                if (sourceState) sourceState.close();
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
            <Form.Item label="数据类型">
              <Select
                defaultValue={subscribeData.type}
                onChange={(e: string) => {
                  subscribeData.type = e;
                  setSubscribeData({ ...subscribeData });
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
        </Tabs.TabPane>

        <Tabs.TabPane tab="推送消息" key="_publish">
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Form.Item label="数据类型">
              <Select
                defaultValue={publishData.type}
                onChange={(e: string) => {
                  publishData.type = e;
                  setPublishData({ ...publishData });
                }}
              >
                <Select.Option value="JSON">JSON</Select.Option>
                <Select.Option value="BINARY">二进制</Select.Option>
                <Select.Option value="STRING">字符串</Select.Option>
                <Select.Option value="HEX">16进制</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="推送数据">
              <Input.TextArea
                rows={4}
                onChange={e => {
                  publishData.data = e.target.value;
                  setPublishData({ ...publishData });
                }}
              />
            </Form.Item>
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default WebSocketClient;
