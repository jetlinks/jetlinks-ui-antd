import { Modal, Button, Divider, Form, Input } from 'antd';
import React, { Fragment, useState } from 'react';
import apis from '@/services';

interface Props {
  close: Function;
  item: any;
  type: string;
  deviceId: string;
}

interface State {
  debugData: string;
  logs: string;
}

const FunctionDebug: React.FC<Props> = props => {
  const { item } = props;
  const initState: State = {
    debugData: "",
    logs: "",
  };

  const [debugData, setDebugData] = useState(initState.debugData);
  const [logs, setLogs] = useState(initState.logs);

  const debugMqttClient = () => {
    apis.deviceInstance
      .invokedFunction(props.deviceId, props.type,JSON.parse(debugData))
      .then(response => {
        const tempResult = response?.result;
        if (response.status === 200) {
          setLogs(tempResult);
        }else{
          setLogs("调试错误");
        }
      }).catch(() => {
        setLogs(`调试错误`);
    });
  };

  return (
    <Modal
      visible
      width={840}
      title={item.name}
      onCancel={() => props.close()}
      footer={
        <Fragment>
          <Button
            type="primary"
            onClick={() => {
              debugMqttClient();
            }}
          >
            执行
          </Button>
          <Divider type="vertical" />
          <Button type="ghost" onClick={() => setLogs('')}>
            清空
          </Button>
        </Fragment>
      }
    >
      <Form labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
        <Form.Item label="参数：">
          <Input.TextArea
            rows={4}
            value={debugData}
            onChange={e => {
              setDebugData(e.target.value);
            }}
            placeholder="参数必须JSON格式"
          />
        </Form.Item>

        <Divider>调试日志</Divider>
        <Input.TextArea rows={4} value={logs} />
      </Form>
    </Modal>
  );
};

export default FunctionDebug;
