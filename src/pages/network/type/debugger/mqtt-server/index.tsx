import { Modal, Button, Divider, Form, Select } from 'antd';

import React, { Fragment, useState } from 'react';
import { getWebsocket } from '@/layouts/GlobalWebSocket';

interface Props {
  close: Function;
  item: any;
}
interface State {
  type: string;
  logs: any[];
}
const MqttServer: React.FC<Props> = props => {
  const { item } = props;
  const initState: State = {
    type: 'JSON',
    logs: [],
  };
  const [type, setType] = useState(initState.type);
  const [logs, setLogs] = useState(initState.logs);
  // const [sourceState, setSourceState] = useState<any>();

  const [subs, setSubs] = useState<any>();

  // useEffect(() => () => subs && subs.unsubscribe());
  const debug = () => {
    logs.push('开始订阅');
    setLogs([...logs]);

    if (subs) {
      subs.unsubscribe()
    }
    const ws = getWebsocket(
      `mqtt-server-debug`,
      `/network/mqtt/server/${item.id}/_subscribe/${type}`,
      {}
    ).subscribe(
      (resp: any) => {
        const { payload } = resp;
        setLogs(l => [...l, JSON.stringify(payload)]);
      }
    );

    setSubs(ws);

    // const eventSource = new EventSourcePolyfill(
    //   wrapAPI(
    //     `/jetlinks/network/mqtt/server/${item.id}/_subscribe/${type}?:X_Access_Token=${getAccessToken()}`,
    //   ));
    // setSourceState(eventSource);
    // eventSource.onerror = () => {
    //   message.error('调试错误');
    // };
    // eventSource.onmessage = e => {
    //   // message.success(e.data);
    //   setLogs(l => [...l, e.data]);
    // };
    // eventSource.onopen = () => {
    //   // setLogs(`${logs}链接成功\n`);
    // };
  };
  return (
    <Modal
      visible
      width={840}
      title="调试MQTT服务"
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
              if (subs) subs.unsubscribe()
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
            defaultValue={type}
            onChange={(e: string) => {
              setType(e);
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
    </Modal>
  );
};
export default MqttServer;
