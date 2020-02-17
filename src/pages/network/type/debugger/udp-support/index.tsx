import { Modal, Button, Divider, Tabs, Form, Input, Select, message } from 'antd';
import React, { Fragment, useState } from 'react';
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
    type: string;
  };
  publishData: {
    debugType: string;
    type: string;
    message: string;
  };
  logs: string;
}

const UdpSupport: React.FC<Props> = props => {
  const { item } = props;
  const initState: State = {
    action: '_subscribe',
    subscribeData: {
      type: 'JSON',
    },
    publishData: {
      debugType: 'push',
      type: 'JSON',
      message: '',
    },
    logs: '',
  };

  const [action, setAction] = useState(initState.action);
  const [subscribeData, setSubscribeData] = useState(initState.subscribeData);
  const [publishData, setPublishData] = useState(initState.publishData);
  const [logs, setLogs] = useState(initState.logs);

  let tempLogs: string = '';

  // const { item: { type: { text } } } = props;
  const debugMqttClient = () => {
    if (action === '_subscribe') {
      tempLogs += '开始订阅\n';
      setLogs(tempLogs);

      const eventSource = new EventSource(
        wrapAPI(
          `/jetlinks/network/upd/${item.id}/_subscribe/${
            subscribeData.type
          }?:X_Access_Token=${getAccessToken()}`,
        ),
      );
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
    } else if (action === '_publish') {
      apis.network
        .debugUdpSupport(item.id, publishData.type, publishData)
        .then(response => {
          if (response) {
            message.success('推送成功');
          }
        })
        .catch(() => {});
    }
  };

  return (
    <Modal
      visible
      width={840}
      title="调试UDP支持"
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
                setLogs(`${logs}关闭订阅\n`);
              }}
            >
              关闭
            </Button>
            <Divider type="vertical" />
            <Button
              type="ghost"
              onClick={() => {
                setLogs('');
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
            <Button type="ghost">清空</Button>
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
            <Input.TextArea rows={4} value={logs} />
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
                  publishData.message = e.target.value;
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

export default UdpSupport;
