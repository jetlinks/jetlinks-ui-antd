import { Modal, Button, Divider, Form, Input, Select, Radio } from 'antd';
import React, { Fragment, useState } from 'react';
import apis from '@/services';

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
  logs: string;
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
    logs: '',
  };

  const [debugData, setDebugData] = useState(initState.debugData);
  const [logs, setLogs] = useState(initState.logs);
  // url: "coap://127.0.0.1:1234"
  // options: "123123"
  // method: "GET"
  // payload: "123123"
  // payloadType: "JSON"
  // const { item: { type: { text } } } = props;
  const debugMqttClient = () => {
    apis.network
      .debugCoapClient(item.id, debugData)
      .then(() => {
        setLogs(`${logs}开始订阅\n`);
      })
      .catch(() => {
        setLogs(`调试错误`);
      });
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
          <Button type="ghost">清空</Button>
        </Fragment>
      }
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
        <Form.Item label="URL">
          <Input
            value={debugData.url}
            onChange={e => {
              debugData.url = e.target.value;
              setDebugData({ ...debugData });
            }}
          />
        </Form.Item>
        <Form.Item label="Option">
          <Input.TextArea
            rows={4}
            value={debugData.options}
            onChange={e => {
              debugData.options = e.target.value;
              setDebugData({ ...debugData });
            }}
          />
        </Form.Item>
        <Form.Item label="Method">
          <Radio.Group
            onChange={e => {
              debugData.method = e.target.value;
              setDebugData({ ...debugData });
            }}
            value={debugData.method}
            buttonStyle="solid"
          >
            <Radio.Button value="GET">GET</Radio.Button>
            <Radio.Button value="POST">POST</Radio.Button>
            <Radio.Button value="PUT">PUT</Radio.Button>
            <Radio.Button value="PATCH">PATCH</Radio.Button>
            <Radio.Button value="DELETE">DELETE</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="消息体">
          <Input.TextArea
            rows={4}
            value={debugData.payload}
            onChange={e => {
              debugData.payload = e.target.value;
              setDebugData({ ...debugData });
            }}
          />
        </Form.Item>
        <Form.Item label="数据类型">
          <Select
            defaultValue={debugData.payloadType}
            onChange={(e: string) => {
              debugData.payloadType = e;
              setDebugData({ ...debugData });
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
    </Modal>
  );
};

export default CoapClient;
