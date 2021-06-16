import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Form, Input, message, Select, Spin } from 'antd';
import { FormComponentProps } from "antd/lib/form";
import AceEditor from "react-ace";
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-json5';
import 'ace-builds/src-noconflict/mode-hjson';
import 'ace-builds/src-noconflict/mode-jsoniq';
import 'ace-builds/src-noconflict/snippets/json';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-eclipse';
import Service from '../service';

interface Props extends FormComponentProps {
  device: any;
  deviceId: string;
}

interface State {
  propertiesData: any[];
  functionsSelectList: any[];
  functionsInfo: any;
  spinning: boolean;
}

const Functions: React.FC<Props> = (props) => {
  const service = new Service('edge-gateway-detail');
  const {
    form: { getFieldDecorator, setFieldsValue },
    form,
  } = props;

  const initState: State = {
    propertiesData: [],
    functionsSelectList: [],
    functionsInfo: {},
    spinning: false,
  };

  const [functionsSelectList] = useState(initState.functionsSelectList);
  const [functionsInfo, setFunctionsInfo] = useState(initState.functionsInfo);
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

    form.validateFields((err, fileValue) => {
      if (err) {
        setSpinning(false);
        return;
      }

      localStorage.setItem(`function-debug-data-${props.device.id}-${fileValue.functionId}`, fileValue.functionData);

      let data;
      try {
        data = JSON.parse(fileValue.functionData);
      } catch (error) {
        message.error('参数错误');
        setSpinning(false);
        return;
      }
      
      service.invokedFunction(props.deviceId, {
        deviceId: props.device.id,
        functionId: fileValue.functionId,
        properties: data
      }).subscribe(response => {
        const tempResult = response?.result[0];
        let result = response?.result;
        if (response.status === 200) {
          if(typeof result === 'string'){
            setFieldsValue({ logs: result });
          }else if(typeof tempResult === 'object'){
            setFieldsValue({ logs: JSON.stringify(tempResult) });
          }else{
            setFieldsValue({ logs: tempResult });
          }
        }else{
          setFieldsValue({ logs: '调试错误' });
        }
        setSpinning(false);
      },() => {},
      () => {setSpinning(false);})
    });
  };

  return (
    <div>
      <Spin spinning={spinning}>
        <Card style={{ marginBottom: 20 }} title="功能调试">
          <Form labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
            <Form.Item label="设备功能">
              {getFieldDecorator('functionId', {
                rules: [
                  { required: true, message: '请选择设备功能' },
                ],
              })(<Select placeholder="请选择设备功能" onChange={(e: any) => {
                const map = {};
                functionsInfo[e].inputs.forEach((item: any) => {
                  map[item.id] = item.name;
                });
                setFieldsValue({
                  'functionData':
                    localStorage.getItem(`function-debug-data-${props.device.id}-${e}`) ||
                    JSON.stringify(map, null, 2)
                });
              }}>
                {functionsSelectList}
              </Select>)}
            </Form.Item>
            <Form.Item label="参数：">
              {getFieldDecorator('functionData', {
                rules: [
                  { required: true, message: '请输入功能参数' },
                ],
              })(
                <AceEditor
                  mode='json'
                  theme="eclipse"
                  name="app_code_editor"
                  key='simulator'
                  fontSize={14}
                  showPrintMargin
                  showGutter
                  wrapEnabled
                  highlightActiveLine  //突出活动线
                  enableSnippets  //启用代码段
                  style={{ width: '100%', height: 300 }}
                  setOptions={{
                    enableBasicAutocompletion: true,   //启用基本自动完成功能
                    enableLiveAutocompletion: true,   //启用实时自动完成功能 （比如：智能代码提示）
                    enableSnippets: true,  //启用代码段
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                />
              )}
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
              <Button type="ghost" onClick={() => setFieldsValue({ logs: undefined })}>
                清空
                </Button>
            </div>

            <Form.Item label="调试结果：" style={{ paddingTop: 20 }}>
              {getFieldDecorator('logs', {})(
                <Input.TextArea rows={4} readOnly />
              )}
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}
  ;

export default Form.create<Props>()(Functions);
