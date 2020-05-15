import { Modal, Button, Divider, Tabs, Form, Input, Select } from 'antd';
import React, { Fragment, useState } from 'react';
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
    topic: string;
    type: string;
    data: string;
  };
  logs: any[];
}

const MqttClient: React.FC<Props> = props => {
  const { item } = props;
  const initState: State = {
    action: '_subscribe',
    subscribeData: {
      topics: '',
      type: 'JSON',
    },
    publishData: {
      topic: '',
      type: 'JSON',
      data: '',
    },
    logs: [],
  };

  const [action, setAction] = useState(initState.action);
  const [subscribeData, setSubscribeData] = useState(initState.subscribeData);
  const [publishData, setPublishData] = useState(initState.publishData);
  const [logs, setLogs] = useState(initState.logs);
  // const { item: { type: { text } } } = props;

  const [subs, setSubs] = useState<any>();
  // let subs: any = 1;
  const [publishSub, setPublishSub] = useState<any>();
  // useEffect(() => () => subs && subs.unsubscribe());
  // useEffect(() => () => publishSub && publishSub.unsubscribe());

  const debugMqttClient = () => {
    if (action === '_subscribe') {
      logs.push(`开始订阅: ${subscribeData.topics}`);
      setLogs([...logs]);

      if (subs) {

        subs.unsubscribe()
      }
      const ws = getWebsocket(
        `mqtt-client-debug-subscribe`,
        `/network/mqtt/client/${item.id}/_subscribe/${subscribeData.type}`,
        {
          topics: subscribeData.topics
        }
      ).subscribe(
        (resp: any) => {
          const { payload } = resp;
          setLogs(l => [...l, JSON.stringify(payload)]);
        }
      );

      setSubs(ws);
      // setLogs(`${logs}开始订阅: ${subscribeData.topics}\n`);
      // console.log('debugMqtt', data);
      // const eventSource = new EventSourcePolyfill(
      //   wrapAPI(
      //     `/jetlinks/network/mqtt/client/${item.id}/_subscribe/${
      //     subscribeData.type
      //     }/?topics=${encodeURIComponent(
      //       subscribeData.topics,
      //     )}&:X_Access_Token=${getAccessToken()}`,
      //   ),
      // );
      // eventSource.onerror = () => {
      //   setLogs([...logs, '断开连接']);
      // };
      // eventSource.onmessage = e => {
      //   setLogs(l => [...l, e.data]);
      // };
      // eventSource.onopen = () => { };




    } else if (action === '_publish') {

      if (publishSub) {
        publishSub.unsubscribe()
      }

      const ws = getWebsocket(
        `mqtt-client-debug-publish`,
        `/network/mqtt/client/${item.id}/_publish/${subscribeData.type}`,
        {
          topic: publishData.topic,
          data: publishData.data
        }
      ).subscribe(
        (resp: any) => {
          const { payload } = resp;
          setLogs(l => [...l, payload]);
        }
      );
      setPublishSub(ws);
      // apis.network
      //   .debugMqttClient(item.id, action, publishData.type, publishData)
      //   .then(response => {
      //     if (response) {
      //       message.success('推送成功');
      //     }
      //   })
      //   .catch(() => { });
    }
  };

  return (
    <Modal
      visible
      width={840}
      title="调试MQTT客户端"
      onCancel={() => props.close()}
      footer={
        <Fragment>
          <Button
            type="primary"
            onClick={() => {
              debugMqttClient();
            }}
          >
            发送
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
      <Tabs defaultActiveKey={action} onChange={e => setAction(e)}>
        <Tabs.TabPane tab="订阅消息" key="_subscribe">
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Form.Item label="订阅Topic">
              <Input.TextArea
                rows={2}
                onChange={e => {
                  subscribeData.topics = e.target.value;
                  setSubscribeData({ ...subscribeData });
                }}
              />
            </Form.Item>
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
            <div style={{ height: 250, overflow: 'auto' }}>
              <pre>{logs.join('\n')}</pre>
            </div>
          </Form>
        </Tabs.TabPane>

        <Tabs.TabPane tab="推送消息" key="_publish">
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Form.Item label="推送Topic">
              <Input
                onChange={e => {
                  publishData.topic = e.target.value;
                  setPublishData({ ...publishData });
                }}
              />
            </Form.Item>
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
          <Divider>调试日志</Divider>
          <div style={{ height: 250, overflow: 'auto' }}>
            <pre>{logs.join('\n')}</pre>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default MqttClient;
