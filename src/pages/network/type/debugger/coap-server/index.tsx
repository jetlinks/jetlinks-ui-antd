import { Modal, Button, Divider, Form, Input, Select } from 'antd';

import React, { Fragment, useState } from 'react';
import { getAccessToken } from '@/utils/authority';
import { wrapAPI } from '@/utils/utils';
import { EventSourcePolyfill } from 'event-source-polyfill';

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
  const [debugData, setDebugData] = useState(initState.debugData);
  const [sourceState, setSourceState] = useState<any>();

  const debug = () => {
    logs.push('开始调试');
    setLogs([...logs]);

    const eventSource = new EventSourcePolyfill(
      wrapAPI(
        `/jetlinks/network/coap/server/${item.id}/_subscribe?options=${debugData.options}&payload=${
        debugData.payload
        }&code=CONTENT&payloadType=${debugData.payloadType}&:X_Access_Token=${getAccessToken()}`,
      ),
    );
    setSourceState(eventSource);
    eventSource.onerror = () => {
      setLogs([...logs, '断开连接']);
    };
    eventSource.onmessage = e => {
      // 追加日志
      // message.success(e.data);
      setLogs(l => [...l, e.data]);
    };
    eventSource.onopen = () => {
      // setLogs(`${logs}开启推送`);
      // message.error('关闭链接');
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
        <Divider>调试日志</Divider>
        <div style={{ height: 350, overflow: 'auto' }}>
          <pre>{logs.join('\n')}</pre>
        </div>
      </Form>
    </Modal>
  );
};
export default CoapServer;
