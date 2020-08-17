import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Form, Input, Select, Spin } from 'antd';
import apis from '@/services';

interface Props {
  device: any
}

interface State {
  propertiesData: any[];
  functionsSelectList: any[];
  functionsInfo: any;
  debugData: string;
  logs: string;
  functionId: string;
  spinning: boolean;
}

const Functions: React.FC<Props> = (props) => {

  const initState: State = {
    propertiesData: [],
    functionsSelectList: [],
    functionsInfo: {},
    debugData: '',
    logs: '',
    functionId: '',
    spinning: false,
  };

  const [functionsSelectList] = useState(initState.functionsSelectList);
  const [functionsInfo, setFunctionsInfo] = useState(initState.functionsInfo);
  const [debugData, setDebugData] = useState(initState.debugData);
  const [logs, setLogs] = useState(initState.logs);
  const [functionId, setFunctionId] = useState(initState.functionId);
  const [spinning, setSpinning] = useState(initState.spinning);

  useEffect(() => {
    const { functions } = JSON.parse(props.device.metadata);
    const map = {};
    functions.forEach((item: any) => {
      map[item.id] = item;
      functionsSelectList.push(<Select.Option key={item.id}>{item.name}</Select.Option>);
    });
    setFunctionsInfo(map);
  }, []);

  const debugFunction = () => {
    setSpinning(true);
    apis.deviceInstance
      .invokedFunction(props.device.id, functionId, JSON.parse(debugData))
      .then(response => {
        const tempResult = response?.result;
        if (response.status === 200) {
          typeof tempResult === 'object' ? setLogs(JSON.stringify(tempResult)) : setLogs(tempResult);
          // setLogs(tempResult);
        }
        setSpinning(false);
      }).catch(() => {
        setLogs(`调试错误`);
      });
  };

  return (
    <div>
      <Spin spinning={spinning}>
        <Card style={{ marginBottom: 20 }} title="功能调试">
          <Form labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
            <Form.Item label="设备功能">
              <Select placeholder="请选择设备功能" onChange={(e: any) => {
                setFunctionId(e);
                const map = {};
                functionsInfo[e].inputs.forEach((item: any) => {
                  map[item.id] = item.name;
                });
                setDebugData(JSON.stringify(map, null, 2));
              }}>
                {functionsSelectList}
              </Select>
            </Form.Item>
            <Form.Item label="参数：">
              <Input.TextArea
                rows={4} style={{ height: '210px' }}
                value={debugData}
                onChange={e => {
                  setDebugData(e.target.value);
                }}
                placeholder="参数必须JSON格式"
              />
            </Form.Item>
            <div style={{ textAlign: 'right' }}>
              <Button
                type="primary"
                onClick={() => {
                  debugFunction();
                }}
              >
                执行
              </Button>
              <Divider type="vertical" />
              <Button type="ghost" onClick={() => setLogs('')}>
                清空
              </Button>
            </div>

            <Form.Item label="调试结果：" style={{ paddingTop: 20 }}>
              <Input.TextArea rows={4} value={logs} readOnly />
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  );
};

export default Functions;
