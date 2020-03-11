import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Upload,
  message,
  Button,
  Icon,
  Col,
  Row,
  Drawer,
  Tabs,
  Collapse,
  Radio,
} from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { ProtocolItem } from '../data';
import { getAccessToken } from '@/utils/authority';
import MonacoEditor from 'react-monaco-editor';
import apis from '@/services';

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
}
const Save: React.FC<Props> = props => {
  const {
    form: { getFieldDecorator },
    form,
  } = props;

  const initState: State = {
    protocolType: props.data?.type,
    jarLocation: props.data?.configuration?.location,
    providers: [],
    activeDebugger: '',
    script: props.data?.configuration?.script,
    debuggerTransports: [],
    debuggerData: {
      type: 'encode',
      payloadType: 'JSON',
      transport: '',
    },
    debugLog: '',
    activeKey: 'mock',
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

  const submitData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      const { id } = props.data;
      const data = fileValue;
      if (data.type === 'script') {
        data.configuration.lang = 'script';
        data.configuration.script = script;
      }
      props.save({
        id,
        ...fileValue,
      });
    });
  };

  const uploadProps = {
    accept: '.jar',
    name: 'file',
    action: `/jetlinks/file/static`,
    showUploadList: false,
    headers: {
      'X-Access-Token': getAccessToken(),
    },
    onChange(info: any) {
      if (info.file.status === 'done') {
        setJarLocation(info.file.response.result);
        message.success(`${info.file.name} 上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  useEffect(() => {
    apis.protocol.providers().then(response => {
      setProviders(response.result);
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
                      <Button type="primary">
                        <Icon type="upload" /> 上传Jar包
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
                  initialValue: props.data?.configuration?.transport,
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
                <MonacoEditor
                  value={script}
                  onChange={e => setScript(e)}
                  language="javascript"
                  height={500}
                  theme="vs-dark"
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
        data.configuration.lang = 'javascript';
        data.configuration.script = script;
        data.configuration.transport = data.configuration.transport.join(',');
      }
      apis.protocol.convert(data).then(response => {
        setDebuggerTransports(response.result?.transports);
      });
    }
  }, [activeDebugger]);

  const startDebug = () => {
    const entity = form.getFieldsValue();
    if (entity.type === 'script') {
      entity.configuration.lang = 'javascript';
      entity.configuration.script = script;
      entity.configuration.transport = entity.configuration.transport.join(',');
    }
    const data = {
      request: debuggerData,
      entity,
    };
    apis.protocol.optionCode(debuggerData.type, data).then(response => {
      setDebugLog(response.result);
      setActiveKey('result');
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
                  {providers.map(item => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))}
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
            <Tabs activeKey={activeKey}>
              <Tabs.TabPane tab="模拟输入" key="mock">
                <Row>
                  <Col span={6}>
                    <Form.Item key="action">
                      <Radio.Group
                        onChange={e => {
                          debuggerData.type = e.target.value;
                          setDebuggerData({ ...debuggerData });
                        }}
                      >
                        <Radio value="decode">编码</Radio>
                        <Radio value="encode">解码</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item key="transport" label="连接类型">
                      <Select
                        onChange={(e: string) => {
                          debuggerData.transport = e;
                          setDebuggerData({ ...debuggerData });
                        }}
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
                      >
                        <Select.Option value="JSON">JSON</Select.Option>
                        <Select.Option value="STRING">STRING</Select.Option>
                        <Select.Option value="HEX">HEX</Select.Option>
                        <Select.Option value="BINARY">BINARY</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Input.TextArea
                  rows={6}
                  onChange={e => {
                    debuggerData.payload = e.target.value;
                    setDebuggerData({ ...debuggerData });
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
