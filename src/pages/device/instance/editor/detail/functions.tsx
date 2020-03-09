import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Form, Input, Select } from 'antd';
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
}

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const Functions: React.FC<Props> = (props) => {

  const initState: State = {
    propertiesData: [],
    functionsSelectList: [],
    functionsInfo: {},
    debugData: '',
    logs: '',
    functionId: '',
  };

  const [functionsSelectList, setFunctionsSelectList] = useState(initState.functionsSelectList);
  const [functionsInfo, setFunctionsInfo] = useState(initState.functionsInfo);
  const [debugData, setDebugData] = useState(initState.debugData);
  const [logs, setLogs] = useState(initState.logs);
  const [functionId, setFunctionId] = useState(initState.functionId);

  useEffect(() => {
    apis.deviceInstance.runInfo(props.device.id)
      .then(response => {
        const tempResult = response?.result;
        if (tempResult) {
          const {functions} = JSON.parse(tempResult.metadata);
          let map = {};
          functions.forEach(item => {
            map[item.id] = item;
            functionsSelectList.push(<Select.Option key={item.id}>{item.name}</Select.Option>);
          });
          setFunctionsInfo(map);
        }
      }).catch(() => {

    });
  }, []);

  const debugFunction = () => {
    apis.deviceInstance
      .invokedFunction(props.device.id, functionId, JSON.parse(debugData))
      .then(response => {
        const tempResult = response?.result;
        if (tempResult) {
          setLogs(tempResult);
        }
      }).catch(() => {
        setLogs(`调试错误`);
    });
  };

  return (
    <div>
      <Card style={{ marginBottom: 20 }} title="功能调试">
        <Form labelCol={{ span: 1 }} wrapperCol={{ span: 23 }}>
          <Form.Item label="设备功能">
            <Select placeholder="请选择设备功能" onChange={e => {
              setFunctionId(e);
              const map = {};
              functionsInfo[e].inputs.forEach(item=>{
                map[item.id] = item.name;
              });
              setDebugData(JSON.stringify(map,null,2))
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
            <Divider type="vertical"/>
            <Button type="ghost" onClick={() => setLogs('')}>
              清空
            </Button>
          </div>

          <Form.Item label="调试日志：" style={{paddingTop:20}}>
            <Input.TextArea rows={4} value={logs}/>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Functions;
