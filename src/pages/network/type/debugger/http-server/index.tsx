import { Modal, Button, Divider, Form, Input, Select, Card, Row, Col, Icon } from 'antd';

import React, { Fragment, useState } from 'react';
import { getAccessToken } from '@/utils/authority';
import { randomString, wrapAPI } from '@/utils/utils';
import { EventSourcePolyfill } from 'event-source-polyfill';

interface Props {
  close: Function;
  item: any;
}
interface State {
  type: string;
  logs: string[];
  debugData: {
    status: string;
    payload: string;
    headers: {
      id: string;
      key: string;
      value: string;
      describe: string;
    }[];
    contentType: string;
  };
}
const HttpServer: React.FC<Props> = props => {
  const { item } = props;
  const initState: State = {
    type: 'JSON',
    logs: [],
    debugData: {
      status: '200',
      payload: '',
      headers: [
        {
          id: randomString(8),
          key: '',
          value: '',
          describe: '',
        },
      ],
      contentType: 'application/json',
    },
  };
  const [type, setType] = useState(initState.type);
  const [logs, setLogs] = useState(initState.logs);
  const [debugData, setDebugData] = useState(initState.debugData);
  const [sourceState, setSourceState] = useState<any>();

  const debug = () => {
    logs.push('开始订阅');
    setLogs([...logs]);
    const eventSource = new EventSourcePolyfill(
      wrapAPI(
        `/jetlinks/network/mqtt/server/${
        item.id
        }/_subscribe/${type}?:X_Access_Token=${getAccessToken()}`,
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
      // message.error('关闭链接');
    };
  };
  return (
    <Modal
      visible
      width={840}
      title="调试HTTP服务"
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
        <Form.Item label="响应头">
          <Card>
            {debugData.headers.map((i, index) => (
              <Row key={i.id} style={{ marginBottom: 5 }}>
                <Col span={6}>
                  <Input
                    value={i.key}
                    onChange={e => {
                      debugData.headers[index].key = e.target.value;
                      setDebugData({ ...debugData });
                    }}
                    placeholder="key"
                  />
                </Col>
                <Col span={2} style={{ textAlign: 'center' }}>
                  <Icon type="double-right" />
                </Col>
                <Col span={6}>
                  <Input
                    value={i.value}
                    onChange={e => {
                      debugData.headers[index].value = e.target.value;
                      setDebugData({ ...debugData });
                    }}
                    placeholder="value"
                  />
                </Col>
                <Col span={2} style={{ textAlign: 'center' }}>
                  <Icon type="double-right" />
                </Col>
                <Col span={6}>
                  <Input
                    value={i.describe}
                    onChange={e => {
                      debugData.headers[index].describe = e.target.value;
                      setDebugData({ ...debugData });
                    }}
                    placeholder="说明"
                  />
                </Col>
                <Col span={2} style={{ textAlign: 'center' }}>
                  {index === 0 ? (
                    <Icon
                      type="plus"
                      onClick={() => {
                        debugData.headers.push({
                          id: randomString(8),
                          key: '',
                          value: '',
                          describe: '',
                        });
                        setDebugData({ ...debugData });
                      }}
                    />
                  ) : (
                      <Icon
                        type="minus"
                        onClick={() => {
                          debugData.headers = debugData.headers.filter(temp => temp.id !== i.id);
                          // debugData.headers.push({ id: randomString(8), key: '', value: '' });
                          setDebugData({ ...debugData });
                        }}
                      />
                    )}
                </Col>
              </Row>
            ))}
          </Card>
        </Form.Item>
        <Form.Item label="响应类型">
          <Select
            value={debugData.contentType}
            onChange={(e: string) => {
              setType(e);
            }}
          >
            <Select.Option value="application/x-www-form-urlencoded">
              application/x-www-form-urlencoded
            </Select.Option>
            <Select.Option value="application/json">application/json</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="响应码">
          <Input
            value={debugData.status}
            onChange={e => {
              debugData.status = e.target.value;
              setDebugData({ ...debugData });
            }}
          />
        </Form.Item>
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
        <Form.Item label="响应数据">
          <Input.TextArea
            value={debugData.payload}
            onChange={e => {
              debugData.payload = e.target.value;
              setDebugData({ ...debugData });
            }}
            rows={3}
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
export default HttpServer;
