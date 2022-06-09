import React, { useEffect, useState } from 'react';
import { Button, Col, Collapse, Drawer, Form, Icon, Input, message, Radio, Row, Select, Tabs, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { ProtocolItem } from '@/pages/device/protocol/data';
import { getAccessToken } from '@/utils/authority';
import apis from '@/services';
import 'ace-builds';
import 'ace-builds/webpack-resolver';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-eclipse';

interface Props extends FormComponentProps {
  close: Function;
  save: Function;
  data: Partial<ProtocolItem>;
}

interface State {
  protocolType?: string;
  jarLocation?: string;
  providers: string[];
  activeDebugger: string;
  script?: string;
  debuggerTransports: any[];
  debuggerData: {
    type: 'encode' | 'decode';
    payloadType: string;
    transport: string;
    payload?: any;
  };
  debugLog: string;
  activeKey: string;
  payload: string;
}

const Save: React.FC<Props> = props => {
  const {
    form: { getFieldDecorator, setFieldsValue },
    form,
  } = props;

  const initState: State = {
    protocolType: props.data?.type,
    jarLocation: props.data?.configuration?.location || props.data?.configuration?.fileId,
    providers: [],
    activeDebugger: '',
    script: props.data?.configuration?.script ? props.data.configuration?.script : '//解码,收到设备上行消息时\n' +
      'codec.decoder(function (context) {\n' +
      '  var message = context.getMessage();\n' +
      '  return {\n' +
      '    messageType:"REPORT_PROPERTY"//消息类型\n' +
      '  };\n' +
      '});\n' +
      '\n' +
      '//编码读取设备属性消息\n' +
      'codec.encoder("READ_PROPERTY",function(context){\n' +
      '  var message = context.getMessage();\n' +
      '  var properties = message.properties;\n' +
      '})',
    debuggerTransports: [],
    debuggerData: {
      type: 'encode',
      payloadType: 'JSON',
      transport: '',
    },
    debugLog: '',
    activeKey: 'mock',
    payload: '',
  };

  const [jarLocation, setJarLocation] = useState(initState.jarLocation);
  const [protocolType, setProtocolType] = useState(initState.protocolType);
  const [providers, setProviders] = useState(initState.providers);
  const [activeDebugger, setActiveDebugger] = useState(initState.activeDebugger);
  const [script, setScript] = useState(initState.script);
  const [debuggerTransports, setDebuggerTransports] = useState(initState.debuggerTransports);
  const [debuggerData, setDebuggerData] = useState(initState.debuggerData);
  const [debugLog, setDebugLog] = useState(initState.debugLog);
  const [activeKey, setActiveKey] = useState(initState.activeKey);
  const [payload, setPayload] = useState<string>(localStorage.getItem(`protocol-payload-encode-debug-data-${props.data.id}`) || '{\n' +
    '  "messageType":"READ_PROPERTY",\n' +
    '  "properties":[\n' +
    '    \n' +
    '  ]\n' +
    '}');

  const [uploading, setUploading] = useState<boolean>(false);
  const submitData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      const data = fileValue;
      if (data.type === 'script') {
        data.configuration.lang = 'js';
        data.configuration.script = script;
        data.configuration.transport = data.configuration.transport.join(',');
      }
      if(data.type === 'jar' || data.type === 'local'){
        data.configuration.fileId = data.configuration.location
      }
      props.save({
        ...fileValue,
      });
    });
  };

  const uploadProps = {
    accept: '.jar,.zip',
    name: 'file',
    action: `/jetlinks/file/upload`,
    showUploadList: false,
    headers: {
      'X-Access-Token': getAccessToken(),
    },
    onChange(info: any) {
      if (info.file.status === 'uploading') {
        setUploading(true);
      }
      if (info.file.status === 'done') {
        setJarLocation(info.file.response.result?.id);
        setFieldsValue({ 'configuration.location': info.file.response.result?.id })
        message.success(`${info.file.name} 上传成功`);
        setUploading(false);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
        setUploading(false);
      }
    },
  };

  useEffect(() => {
    apis.protocol.providers().then(response => {
      if (response.status === 200) {
        setProviders(response.result);
      }
    });
  }, []);

  const renderTypeForm = () => {
    if (protocolType === 'jar') {
      return (
        <div>
          <Row>
            <Col span={12}>
              <Form.Item key="provider" label="类名">
                {getFieldDecorator('configuration.provider', {
                  initialValue: props.data?.configuration?.provider,
                  rules: [{ required: true, message: '请输入类名' }],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item key="location" label="文件地址">
                <Row>
                  <Col span={14}>
                    {getFieldDecorator('configuration.location', {
                      initialValue: jarLocation,
                      rules: [{ required: true, message: '请输入文件地址' }],
                    })(<Input />)}
                  </Col>
                  <Col span={2}>
                    <Upload {...uploadProps}>
                      <Button type="primary" disabled={uploading}>
                        <Icon type="upload" /> {uploading ? '正在上传...' : '上传Jar包'}
                      </Button>
                    </Upload>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
          </Row>
        </div>
      );
    }
    if (protocolType === 'local') {
      return (
        <div>
          <Row>
            <Col span={12}>
              <Form.Item key="provider" label="类名">
                {getFieldDecorator('configuration.provider', {
                  initialValue: props.data?.configuration?.provider,
                  rules: [{ required: true, message: '请输入类名' }],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item key="location" label="文件地址">
                {getFieldDecorator('configuration.location', {
                  initialValue: jarLocation,
                  rules: [{ required: true, message: '请输入文件地址' }],
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>
        </div>
      );
    }
    if (protocolType === 'script') {
      return (
        <div>
          <Row>
            <Col span={12}>
              <Form.Item key="protocol" label="协议标识">
                {getFieldDecorator('configuration.protocol', {
                  initialValue: props.data?.configuration?.protocol,
                  rules: [{ required: true, message: '请输入协议标识' }],
                })(<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item key="transport" label="连接协议">
                {getFieldDecorator('configuration.transport', {
                  initialValue: props.data?.configuration?.transport?.split(','),
                  rules: [{ required: true, message: '请输入连接协议' }],
                })(
                  <Select mode="multiple">
                    <Select.Option value="MQTT">MQTT</Select.Option>
                    <Select.Option value="UDP">UDP</Select.Option>
                    <Select.Option value="CoAP">CoAP</Select.Option>
                    <Select.Option value="TCP">TCP</Select.Option>
                    <Select.Option value="HTTP">HTTP</Select.Option>
                    <Select.Option value="HTTPS">HTTPS</Select.Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="脚本" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
                <AceEditor
                  mode='javascript'
                  theme="eclipse"
                  name="app_code_editor"
                  fontSize={14}
                  showPrintMargin
                  showGutter
                  onChange={value => {
                    setScript(value);
                  }}
                  value={script}
                  wrapEnabled
                  highlightActiveLine  //突出活动线
                  enableSnippets  //启用代码段
                  style={{ width: '100%', height: 500 }}
                  setOptions={{
                    enableBasicAutocompletion: true,   //启用基本自动完成功能
                    enableLiveAutocompletion: true,   //启用实时自动完成功能 （比如：智能代码提示）
                    enableSnippets: true,  //启用代码段
                    showLineNumbers: true,
                    tabSize: 2,
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    if (activeDebugger === 'debugger') {
      const data = form.getFieldsValue();
      if (data.type === 'script') {
        data.configuration.lang = 'js';
        data.configuration.script = script;
        data.configuration.transport = data.configuration.transport.join(',');
      }
      apis.protocol.convert(data).then(response => {
        if (response.status === 200) {
          setDebuggerTransports(response.result?.transports);
        } else {
          setActiveDebugger('debugger');
        }
      });
    }
  }, [activeDebugger]);

  const startDebug = () => {
    const entity = form.getFieldsValue();
    if (entity.type === 'script') {
      entity.configuration.lang = 'js';
      entity.configuration.script = script;
      entity.configuration.transport = entity.configuration.transport.join(',');
    }
    debuggerData.payload = debuggerData.payload ? debuggerData.payload : payload;
    const data = {
      request: debuggerData,
      entity,
    };
    apis.protocol.optionCode(debuggerData.type, data).then(response => {
      if (response.status === 200) {
        setDebugLog(response.result);
        setActiveKey('result');
      }
    });
  };
  return (
    <Drawer
      visible
      width={900}
      onClose={() => props.close()}
      title={`${props.data?.id ? '编辑' : '新增'}协议`}
    >
      <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
        <Row>
          <Col span={12}>
            <Form.Item key="id" label="协议ID">
              {getFieldDecorator('id', {
                rules: [{ required: true, message: '协议标识' }],
                initialValue: props.data?.id,
              })(<Input placeholder="请输入协议ID" disabled={!!props.data.id} />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="name" label="协议名称">
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '协议名称' }],
                initialValue: props.data?.name,
              })(<Input placeholder="请输入协议名称" />)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="type" label="类型">
              {getFieldDecorator('type', {
                rules: [{ required: true, message: '协议类型' }],
                initialValue: props.data?.type,
              })(
                <Select
                  placeholder="请选择协议类型"
                  onChange={(value: string) => {
                    setProtocolType(value);
                  }}
                >
                  {
                    providers.map(i => {
                      return <Select.Option key={i} value={i}>{i}</Select.Option>
                    })
                  }
                  {/* <Select.Option value="script">
                    script
                  </Select.Option>
                  <Select.Option value="jar">
                    jar
                  </Select.Option>
                  <Select.Option value="local">
                    local
                  </Select.Option> */}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>

        {renderTypeForm()}

        <Form.Item key="description" label="描述" labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
          {getFieldDecorator('description', {
            initialValue: props.data?.description,
          })(<Input />)}
        </Form.Item>
        <Collapse
          onChange={() => {
            form.validateFields(err => {
              if (!err) {
                setActiveDebugger(activeDebugger !== 'debugger' ? 'debugger' : '');
              } else {
                setActiveDebugger('');
              }
            });
          }}
          activeKey={activeDebugger}
          bordered={false}
          expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
        >
          <Collapse.Panel
            header="调试"
            key="debugger"
            style={{
              background: '#f7f7f7',
              borderRadius: 4,
              marginBottom: 24,
              border: 0,
              overflow: 'hidden',
            }}
          >
            <Tabs activeKey={activeKey} onChange={e => setActiveKey(e)}>
              <Tabs.TabPane tab="模拟输入" key="mock">
                <Row>
                  <Col span={6}>
                    <Form.Item key="action">
                      <Radio.Group
                        onChange={e => {
                          debuggerData.type = e.target.value;
                          setDebuggerData({ ...debuggerData });
                          if (e.target.value === 'encode') {
                            setPayload(localStorage.getItem(`protocol-payload-encode-debug-data-${props.data.id}`) || '{\n' +
                              '  "messageType":"READ_PROPERTY",\n' +
                              '  "properties":[\n' +
                              '    \n' +
                              '  ]\n' +
                              '}');
                          } else {
                            if (`protocol-payload-decode-debug-data${props.data.id}` || payload === '') {
                              switch (debuggerData.transport) {
                                case 'HTTP':
                                  setPayload(localStorage.getItem(`protocol-payload-decode-debug-data-${props.data.id}`) || 'POST /url\n' +
                                    'Content-Type: application/json\n' +
                                    '\n' +
                                    '{}');
                                  break;
                                case 'MQTT':
                                  setPayload(localStorage.getItem(`protocol-payload-decode-debug-data-${props.data.id}`) || 'QoS0 /topic\n' +
                                    '\n' +
                                    '{}');
                                  break;
                                case 'CoAP':
                                  setPayload(localStorage.getItem(`protocol-payload-decode-debug-data-${props.data.id}`) || 'POST /url\n' +
                                    'Content-Format: application/json\n' +
                                    '\n' +
                                    '{}');
                                  break;
                                default:
                                  setPayload(localStorage.getItem(`protocol-payload-decode-debug-data-${props.data.id}`) || '');
                                  return;
                              }
                            } else {
                              setPayload(localStorage.getItem(`protocol-payload-decode-debug-data-${props.data.id}`) || '');
                            }
                          }
                        }}
                        defaultValue="encode"
                      >
                        <Radio value="encode">编码</Radio>
                        <Radio value="decode">解码</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item key="transport" label="连接类型">
                      <Select
                        onChange={(e: string) => {
                          debuggerData.transport = e;
                          setDebuggerData({ ...debuggerData });
                          if (debuggerData.type === 'decode') {
                            switch (e) {
                              case 'HTTP':
                                setPayload(localStorage.getItem(`protocol-payload-decode-debug-data-${props.data.id}`) || 'POST /url\n' +
                                  'Content-Type: application/json\n' +
                                  '\n' +
                                  '{}');
                                break;
                              case 'MQTT':
                                setPayload(localStorage.getItem(`protocol-payload-decode-debug-data-${props.data.id}`) || 'QoS0 /topic\n' +
                                  '\n' +
                                  '{}');
                                break;
                              case 'CoAP':
                                setPayload(localStorage.getItem(`protocol-payload-decode-debug-data-${props.data.id}`) || 'POST /url\n' +
                                  'Content-Format: application/json\n' +
                                  '\n' +
                                  '{}');
                                break;
                              default:
                                setPayload(localStorage.getItem(`protocol-payload-decode-debug-data-${props.data.id}`) || '');
                                return;
                            }
                          }
                        }}
                        defaultValue={debuggerTransports[0] || null}
                      >
                        {debuggerTransports.map(item => (
                          <Select.Option key={item.id} value={item.id}>
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col span={8} offset={2}>
                    <Form.Item key="payloadType" label="消息类型">
                      <Select
                        onChange={(e: string) => {
                          debuggerData.payloadType = e;
                          setDebuggerData({ ...debuggerData });
                        }}
                        defaultValue="JSON"
                      >
                        <Select.Option value="JSON">JSON</Select.Option>
                        <Select.Option value="STRING">STRING</Select.Option>
                        <Select.Option value="HEX">HEX</Select.Option>
                        <Select.Option value="BINARY">BINARY</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <AceEditor
                  mode='javascript'
                  theme="eclipse"
                  name="app_code_editor"
                  fontSize={14}
                  showPrintMargin
                  showGutter
                  onChange={value => {
                    debuggerData.payload = value;
                    setDebuggerData({ ...debuggerData });
                    setPayload(value);
                    if (debuggerData.type === 'decode') {
                      localStorage.setItem(`protocol-payload-decode-debug-data-${props.data.id}`, value);
                    } else {
                      localStorage.setItem(`protocol-payload-encode-debug-data-${props.data.id}`, value);
                    }
                  }}
                  value={payload}
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
                <Button type="danger" onClick={() => startDebug()}>
                  执行
                </Button>
              </Tabs.TabPane>
              <Tabs.TabPane tab="运行结果" key="result">
                <Input.TextArea rows={5} value={debugLog} />
              </Tabs.TabPane>
            </Tabs>
          </Collapse.Panel>
        </Collapse>
      </Form>
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button
          onClick={() => {
            props.close();
          }}
          style={{ marginRight: 8 }}
        >
          关闭
        </Button>
        <Button
          onClick={() => {
            submitData();
          }}
          type="primary"
        >
          确认
        </Button>
      </div>
    </Drawer>
  );
};
export default Form.create<Props>()(Save);
