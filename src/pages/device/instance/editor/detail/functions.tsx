import React, {useEffect, useState} from 'react';
import {Button, Card, Divider, Form, Input, Select, Spin} from 'antd';
import apis from '@/services';
import {FormComponentProps} from "antd/lib/form";

interface Props extends FormComponentProps {
  device: any
}

interface State {
  propertiesData: any[];
  functionsSelectList: any[];
  functionsInfo: any;
  logs: string;
  spinning: boolean;
}

const Functions: React.FC<Props> = (props) => {

    const {
      form: {getFieldDecorator, setFieldsValue},
      form,
    } = props;

    const initState: State = {
      propertiesData: [],
      functionsSelectList: [],
      functionsInfo: {},
      logs: '',
      spinning: false,
    };

    const [functionsSelectList] = useState(initState.functionsSelectList);
    const [functionsInfo, setFunctionsInfo] = useState(initState.functionsInfo);
    const [logs, setLogs] = useState(initState.logs);
    const [spinning, setSpinning] = useState(initState.spinning);

    useEffect(() => {
      const {functions} = JSON.parse(props.device.metadata);
      const map = {};
      functions.forEach((item: any) => {
        map[item.id] = item;
        functionsSelectList.push(<Select.Option key={item.id}>{item.name}</Select.Option>);
      });
      setFunctionsInfo(map);
    }, []);

    const debugFunction = () => {
      setSpinning(true);

      form.validateFields((err, fileValue) => {
        if (err) return;

        localStorage.setItem(`function-debug-data-${props.device.id}-${fileValue.functionId}`, fileValue.functionData);

        apis.deviceInstance
          .invokedFunction(props.device.id, fileValue.functionId, JSON.parse(fileValue.functionData))
          .then(response => {
            const tempResult = response?.result;
            if (response.status === 200) {
              typeof tempResult === 'object' ? setLogs(JSON.stringify(tempResult)) : setLogs(tempResult);
            }
            setSpinning(false);
          }).catch(() => {
          setLogs(`调试错误`);
        });
      });
    };

    return (
      <div>
        <Spin spinning={spinning}>
          <Card style={{marginBottom: 20}} title="功能调试">
            <Form labelCol={{span: 2}} wrapperCol={{span: 22}}>
              <Form.Item label="设备功能">
                {getFieldDecorator('functionId', {
                  rules: [
                    {required: true, message: '请选择设备功能'},
                  ],
                })(<Select placeholder="请选择设备功能" onChange={(e: any) => {
                  const map = {};
                  functionsInfo[e].inputs.forEach((item: any) => {
                    map[item.id] = item.name;
                  });
                  setFieldsValue({
                    'functionData':
                      localStorage.getItem(`function-debug-data-${props.device.id}-${e}`) || JSON.stringify(map, null, 2)
                  });
                }}>
                  {functionsSelectList}
                </Select>)}
              </Form.Item>
              <Form.Item label="参数：">
                {getFieldDecorator('functionData', {
                  rules: [
                    {required: true, message: '请输入功能参数'},
                  ],
                })(<Input.TextArea
                  rows={4} style={{height: '210px'}}
                  placeholder="参数必须JSON格式"
                />)}
              </Form.Item>
              <div style={{textAlign: 'right'}}>
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

              <Form.Item label="调试结果：" style={{paddingTop: 20}}>
                <Input.TextArea rows={4} value={logs} readOnly/>
              </Form.Item>
            </Form>
          </Card>
        </Spin>
      </div>
    );
  }
;

export default Form.create<Props>()(Functions);
