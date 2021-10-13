import {
  Modal,
  Button,
  Divider,
  Form,
  Input,
} from 'antd';

import React, { Fragment, useState } from 'react';
import { getWebsocket } from '@/layouts/GlobalWebSocket';

interface Props {
  close: Function;
  item: any;
}
interface State {
  type: string;
  logs: string[];
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
      value: string[];
      describe: string;
    }[];
    tempParameters: {
      id: string;
      key: string;
      value: string;
      describe: string;
    }[];
    queryParameters: any;
  };
}
const HttpClient: React.FC<Props> = props => {

  const { item } = props;
  const [debugData, setDebugData] = useState<string>(localStorage.getItem('http-client-debug-data') || 'POST http://host:port/api\nContent-Type: application/json\n\n{ }');
  const [subs, setSubs] = useState<any>();
  const [logs, setLogs] = useState<string[]>([]);

  const debug = () => {
    // status: 200
    // payload:
    // headers: JTVCJTdCJTIybmFtZSUyMjolMjIxJTIyLCUyMnZhbHVlJTIyOiU1QiUyMjIlMjIlNUQlN0QsJTdCJTIybmFtZSUyMjolMjIxMiUyMiwlMjJ2YWx1ZSUyMjolNUIlMjIyMSUyMiU1RCU3RCU1RA ==
    //   contentType: application / x - www - form - urlencoded
    // setLogs(`${logs}开始订阅\n`);

    // if (debugData && debugData.tempParameters) {
    //   const params = debugData.tempParameters;
    //   const queryParameters = {};
    //   params.forEach(i => {
    //     queryParameters[i.key] = i.value;
    //   });
    //   debugData.queryParameters = queryParameters;
    // }
    // apis.network
    //   .debugHttpClient(item.id, debugData)
    //   .then(response => {
    //     if (response) {
    //       message.success('发送成功');
    //     }
    //   })
    //   .catch(() => { });

    if (subs) {
      subs.unsubscribe()
    }
    const ws = getWebsocket(
      `http-client-debug`,
      `/network/http/client/${item.id}/_send`,
      {
        request: debugData
      }
    ).subscribe(
      (resp: any) => {
        const { payload } = resp;
        setLogs(l => [...l, payload, '\n']);
      }
    );
    setSubs(ws);
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
            type="ghost"
            onClick={() => {
              setLogs([]);
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
        <Form.Item label="HTTP请求">
          <Input.TextArea
            rows={8}
            onChange={e => {
              setDebugData(e.target.value);
              localStorage.setItem('http-client-debug-data', e.target.value);
            }}
            value={debugData}

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
export default HttpClient;
