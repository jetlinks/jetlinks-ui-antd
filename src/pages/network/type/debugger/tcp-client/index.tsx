import { Modal, Button, Divider, Tabs, Form, Input, Select } from 'antd';
import React, { Fragment, useState, useEffect } from 'react';
import { getAccessToken } from '@/utils/authority';
import apis from '@/services';
import { wrapAPI } from '@/utils/utils';

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
  let eventSource: EventSource | null = null;

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
  const [subscribeData, setSubscribeData] = useState(initState.subscribeData);
  const [publishData, setPublishData] = useState(initState.publishData);
  const [logs, setLogs] = useState(initState.logs);
  const [sourceState, setSourceState] = useState<any>();

  const debugMqttClient = () => {
    logs.push('开始调试');
    setLogs([...logs]);
    if (action === '_subscribe') {
      eventSource = new EventSource(
        wrapAPI(
          `/jetlinks/network/mqtt/client/${item.id}/_subscribe/${
            subscribeData.type
          }/?topics=${encodeURIComponent(
            subscribeData.topics,
          )}&:X_Access_Token=${getAccessToken()}`,
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
    } else if (action === '_publish') {
      apis.network
        .debugTcpClient(item.id, publishData.type, publishData.data)
        .then(() => {})
        .catch(() => {});
    }
  };

  useEffect(
    () => () => {
      if (eventSource) {
        eventSource.close();
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

export default TcpClient;
