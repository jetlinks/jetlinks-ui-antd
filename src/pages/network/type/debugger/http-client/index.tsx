import {
  Modal,
  Button,
  Divider,
  Form,
  Input,
  Select,
  message,
  Radio,
  Row,
  Col,
  Icon,
  Card,
} from 'antd';

import React, { Fragment, useState } from 'react';
// import { getAccessToken } from '@/utils/authority';
import apis from '@/services';
import { randomString } from '@/utils/utils';

interface Props {
  close: Function;
  item: any;
}
interface State {
  type: string;
  logs: string;
  debugData: {
    url: string;
    method: string;
    contentType: string;
    bodyType: string;
    payload: any;
    requestPayloadType: string;
    responsePayloadType: string;
    headers: {
      id: string;
      key: string;
      value: string;
      describe: string;
    }[];
    queryParameters: {
      id: string;
      key: string;
      value: string;
      describe: string;
    }[];
  };
}
const HttpClient: React.FC<Props> = props => {
  const { item } = props;
  const initState: State = {
    type: 'JSON',
    logs: '',
    debugData: {
      url: '',
      method: 'GET',
      contentType: '',
      bodyType: '',
      payload: undefined,
      requestPayloadType: '',
      responsePayloadType: '',
      headers: [
        {
          id: randomString(8),
          key: '',
          value: '',
          describe: '',
        },
      ],
      queryParameters: [
        {
          id: randomString(8),
          key: '',
          value: '',
          describe: '',
        },
      ],
    },
  };
  const [logs, setLogs] = useState(initState.logs);
  const [debugData, setDebugData] = useState(initState.debugData);

  const debug = () => {
    // status: 200
    // payload:
    // headers: JTVCJTdCJTIybmFtZSUyMjolMjIxJTIyLCUyMnZhbHVlJTIyOiU1QiUyMjIlMjIlNUQlN0QsJTdCJTIybmFtZSUyMjolMjIxMiUyMiwlMjJ2YWx1ZSUyMjolNUIlMjIyMSUyMiU1RCU3RCU1RA ==
    //   contentType: application / x - www - form - urlencoded
    setLogs(`${logs}开始订阅\n`);

    apis.network
      .debugHttpClient(item.id, debugData)
      .then(response => {
        if (response) {
          message.success('发送成功');
        }
      })
      .catch(() => {});
  };

  const renderRequeryType = () => {
    const { method } = debugData;
    switch (method) {
      case 'POST':
      case 'PUT':
      case 'PATCH':
        return (
          <Form.Item label="请求类型">
            <Select>
              <Select.Option value="application/x-www-form-urlencoded">
                application/x-www-form-urlencoded
              </Select.Option>
              <Select.Option value="application/json">application/json</Select.Option>
            </Select>
          </Form.Item>
        );
      default:
        return null;
    }
  };

  const renderPayload = () => {
    const { bodyType } = debugData;
    if (bodyType === 'x-www-urlencoded') {
      debugData.payload =
        typeof debugData.payload === 'object'
          ? debugData.payload
          : [
              {
                id: randomString(8),
                key: '',
                value: '',
                describe: '',
              },
            ];
      return (
        <Form.Item label="消息体">
          <Card>
            {debugData.payload.map(
              (
                i: {
                  id: string;
                  key: string;
                  value: string;
                  describe: string;
                },
                index: number,
              ) => (
                <Row key={i.id} style={{ marginBottom: 5 }}>
                  <Col span={6}>
                    <Input
                      value={i.key}
                      onChange={e => {
                        (debugData.payload[index] as {
                          id: string;
                          key: string;
                          value: string;
                          describe: string;
                        }).key = e.target.value;
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
                        (debugData.payload[index] as {
                          id: string;
                          key: string;
                          value: string;
                          describe: string;
                        }).value = e.target.value;
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
                        (debugData.payload[index] as {
                          id: string;
                          key: string;
                          value: string;
                          describe: string;
                        }).describe = e.target.value;
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
                          (debugData.payload as {
                            id: string;
                            key: string;
                            value: string;
                            describe: string;
                          }[]).push({ id: randomString(8), key: '', value: '', describe: '' });
                          setDebugData({ ...debugData });
                        }}
                      />
                    ) : (
                      <Icon
                        type="minus"
                        onClick={() => {
                          debugData.payload = (debugData.payload as {
                            id: string;
                            key: string;
                            value: string;
                            describe: string;
                          }[]).filter(temp => temp.id !== i.id);
                          // debugData.headers.push({ id: randomString(8), key: '', value: '' });
                          setDebugData({ ...debugData });
                        }}
                      />
                    )}
                  </Col>
                </Row>
              ),
            )}
          </Card>
        </Form.Item>
      );
    }
    if (bodyType === 'raw') {
      return (
        <Form.Item label="消息体">
          <Input.TextArea
            rows={3}
            placeholder="JSON格式"
            value={typeof debugData.payload === 'string' ? debugData.payload : ''}
            onChange={e => {
              debugData.payload = e.target.value;
              setDebugData({ ...debugData });
            }}
          />
        </Form.Item>
      );
    }
    return null;
  };
  return (
    <Modal
      visible
      width={840}
      title="调试HTTP客户端"
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
              setLogs(`${logs}关闭订阅\n`);
            }}
          >
            结束
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
      }
    >
      <Form
        labelCol={{ span: 4 }}
        style={{ overflowY: 'auto', height: 500 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item label="URL">
          <Input
            value={debugData.url}
            onChange={e => {
              debugData.url = e.target.value;
              setDebugData({ ...debugData });
            }}
          />
        </Form.Item>
        <Form.Item label="请求方法">
          <Radio.Group
            value={debugData.method}
            onChange={e => {
              debugData.method = e.target.value;
              setDebugData({ ...debugData });
            }}
            buttonStyle="solid"
          >
            <Radio.Button value="GET">GET</Radio.Button>
            <Radio.Button value="POST">POST</Radio.Button>
            <Radio.Button value="PUT">PUT</Radio.Button>
            <Radio.Button value="PATCH">PATCH</Radio.Button>
            <Radio.Button value="DELETE">DELETE</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {renderRequeryType()}
        <Form.Item label="请求头">
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
        <Form.Item label="请求参数">
          <Card>
            {debugData.queryParameters.map((i, index) => (
              <Row key={i.id} style={{ marginBottom: 5 }}>
                <Col span={6}>
                  <Input
                    value={i.key}
                    onChange={e => {
                      debugData.queryParameters[index].key = e.target.value;
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
                      debugData.queryParameters[index].value = e.target.value;
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
                      debugData.queryParameters[index].describe = e.target.value;
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
                        debugData.queryParameters.push({
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
                        debugData.queryParameters = debugData.queryParameters.filter(
                          temp => temp.id !== i.id,
                        );
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
        <Form.Item label="消息体类型">
          <Radio.Group
            value={debugData.bodyType}
            onChange={e => {
              debugData.bodyType = e.target.value;
              setDebugData({ ...debugData });
            }}
            buttonStyle="solid"
          >
            <Radio.Button value="x-www-urlencoded">x-www-urlencoded</Radio.Button>
            <Radio.Button value="raw">raw</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {renderPayload()}
        <Form.Item label="请求数据类型">
          <Select
            defaultValue={debugData.requestPayloadType}
            onChange={(e: string) => {
              debugData.requestPayloadType = e;
              setDebugData({ ...debugData });
            }}
          >
            <Select.Option value="JSON">JSON</Select.Option>
            <Select.Option value="BINARY">二进制</Select.Option>
            <Select.Option value="STRING">字符串</Select.Option>
            <Select.Option value="HEX">16进制</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="响应数据类型">
          <Select
            defaultValue={debugData.responsePayloadType}
            onChange={(e: string) => {
              debugData.responsePayloadType = e;
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
        {/* </Form.Item> */}
      </Form>
    </Modal>
  );
};
export default HttpClient;
