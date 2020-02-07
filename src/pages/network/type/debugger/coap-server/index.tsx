import { Modal, Button, Divider, Form, Input, Select, message } from 'antd';

import React, { Fragment, useState } from 'react';
import { getAccessToken } from '@/utils/authority';

interface Props {
  close: Function;
  item: any;
}

interface State {
  logs: string;
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
    logs: '',
    debugData: {
      options: '',
      payload: '',
      code: 'CONTENT',
      payloadType: 'JSON',
    },
  };
  const [logs, setLogs] = useState(initState.logs);
  const [debugData, setDebugData] = useState(initState.debugData);

  const debug = () => {
    setLogs(`${logs}开始调试\n`);
    // http://2.jetlinks.org:9010/network/coap/server/1211175788462309376/_subscribe?options=hhdhhdhdhwer&payload=12333&code=CONTENT&payloadType=JSON&:X_Access_Token=93f009e29b8685f2b87275e84c8e6fcb
    // return url + "?options=" + options + "&payload=" + payload + "&code=CONTENT&payloadType=" + payloadType

    const eventSource = new EventSource(
      `/jetlinks/network/coap/server/${item.id}/_subscribe?options=${debugData.options}&payload=${
        debugData.payload
      }&code=CONTENT&payloadType=${debugData.payloadType}&:X_Access_Token=${getAccessToken()}`,
    );
    eventSource.onerror = () => {
      message.error('调试错误');
    };
    eventSource.onmessage = e => {
      // 追加日志
      message.success(e.data);
    };
    eventSource.onopen = () => {
      setLogs(`${logs}开启推送`);
      message.error('关闭链接');
    };
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
              setLogs(`${logs}结束调试\n`);
            }}
          >
            结束
          </Button>
          <Divider type="vertical" />
          <Button type="ghost" onClick={() => setLogs('')}>
            清空
          </Button>
        </Fragment>
      }
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
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
        <Form.Item label="回复内容">
          <Input
            value={debugData.payload}
            onChange={e => {
              debugData.payload = e.target.value;
              setDebugData({ ...debugData });
            }}
            placeholder="自动回复的内容"
          />
        </Form.Item>
        <Form.Item label="Option">
          <Input.TextArea
            value={debugData.options}
            onChange={e => {
              debugData.options = e.target.value;
              setDebugData({ ...debugData });
            }}
            rows={3}
            placeholder="e.g.option: value 以换行符分割"
          />
        </Form.Item>
        <Form.Item label="调试日志">
          <Input.TextArea rows={4} value={logs} placeholder="只会接收最新的客户端链接" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CoapServer;
