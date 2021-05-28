import React, { useState, useEffect } from 'react';
import { Form, Input, Drawer, Button, Select, Radio, InputNumber, Tooltip, Icon, Collapse, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import styles from './index.less';
import apis from '@/services';
import 'ace-builds';
import 'ace-builds/webpack-resolver';
import AceEditor from "react-ace";
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-groovy';
import 'ace-builds/src-noconflict/snippets/javascript';
import 'ace-builds/src-noconflict/snippets/groovy';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-eclipse';
import Add from './add'
import { CaretRightOutlined, DeleteOutlined } from '@ant-design/icons/lib/icons';

interface Props extends FormComponentProps {
  close: Function;
  data: any;
  save: Function;
}

interface State {
  dataType: string;
  supportsType: any[];
  certificateList: any[];
  tcpServerParseType: string;
  mode: string;
  clusterType: boolean;
  clusterList: any[];
  isModalVisible: boolean;
}

const Save: React.FC<Props> = props => {
  const version = localStorage.getItem('system-version');
  const initState: State = {
    dataType: props.data.type,
    supportsType: [],
    certificateList: [],
    tcpServerParseType: props.data?.configuration?.parserType || 'DIRECT',
    mode: props.data?.configuration?.parserConfiguration?.lang || "javascript",
    clusterType: props.data?.shareCluster === undefined ? true : props.data?.shareCluster,
    clusterList: [],
    isModalVisible: false
  };
  const {
    form: { getFieldDecorator },
    form,
  } = props;
  const [dataType, setDataType] = useState(initState.dataType);
  const [supportsType, setSupportsType] = useState(initState.supportsType);
  const [certificateList, setCertificateList] = useState(initState.certificateList);
  const [tcpServerParseType, setTcpServerParseType] = useState(initState.tcpServerParseType);
  const [mode, setMode] = useState(initState.mode);
  const [clusterType, setClusterType] = useState(initState.clusterType);
  const [clusterList, setClusterList] = useState(initState.clusterList);
  const [isModalVisible, setIsModalVisible] = useState(initState.isModalVisible);


  useEffect(() => {
    apis.network
      .support()
      .then(response => {
        if (response.status === 200) {
          setSupportsType(response.result || []);
        }
      })
      .catch(() => {
      });
    apis.certificate
      .listNoPaging({ paging: false })
      .then(response => {
        if (response.status === 200) {
          setCertificateList(response.result || []);
        }
      })
      .catch(() => {
      });
    if(version === 'pro'){
      if (props.data.id && props.data.cluster) {
        if (props.data.cluster) {
          let data: any[] = []
          props.data.cluster.map(item => {
            data.push(item.serverId)
          })
          setClusterList([...data])
        }
      } else {
        apis.network.getNodesList().then(res => {
          if (res.status === 200) {
            let data: any[] = []
            res.result.forEach(item => {
              data.push(item.id)
            })
            setClusterList([...data])
          }
        })
      }
    }
  }, []);

  const handleOk = (node: string) => {
    let data = [...clusterList]
    data.push(node)
    setClusterList([...data])
    setIsModalVisible(false)
  }
  const renderTcpServerParse = (index: number) => {
    if (clusterType) {
      switch (tcpServerParseType) {
        case 'delimited':
          return (
            <Form.Item label="分隔符">
              {getFieldDecorator('configuration.parserConfiguration.delimited', {
                initialValue: props.data?.configuration?.parserConfiguration?.delimited,
              })(<Input />)}
            </Form.Item>
          );
        case 'script':
          return (
            <>
              <Form.Item label="脚本语言">
                {getFieldDecorator('configuration.parserConfiguration.lang', {
                  initialValue: props.data?.configuration?.parserConfiguration?.lang,
                })(
                  <Radio.Group buttonStyle="solid" onChange={(event) => {
                    setMode(event.target.value);
                  }}>
                    <Radio.Button value="javascript">JavaScript</Radio.Button>
                    <Radio.Button value="groovy">Groovy</Radio.Button>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="解析脚本">
                {getFieldDecorator('configuration.parserConfiguration.script', {
                  initialValue: props.data?.configuration?.parserConfiguration?.script,
                })(
                  <AceEditor
                    mode={mode}
                    theme="eclipse"
                    name="app_code_editor"
                    key='networkShadow'
                    fontSize={14}
                    showPrintMargin
                    showGutter
                    wrapEnabled
                    highlightActiveLine  //突出活动线
                    enableSnippets  //启用代码段
                    style={{ width: '100%', height: '35vh' }}
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
            </>
          );
        case 'fixed_length':
          return (
            <Form.Item label="长度值">
              {getFieldDecorator('configuration.parserConfiguration.size', {
                initialValue: props.data?.configuration?.parserConfiguration?.size,
              })(<Input />)}
            </Form.Item>
          );
        default:
          return null;
      }
    } else {
      switch (tcpServerParseType) {
        case 'delimited':
          return (
            <Form.Item label="分隔符">
              {getFieldDecorator(`cluster[${index}].configuration.parserConfiguration.delimited`, {
                initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.parserConfiguration?.delimited : '',
              })(<Input />)}
            </Form.Item>
          );
        case 'script':
          return (
            <>
              <Form.Item label="脚本语言">
                {getFieldDecorator(`cluster[${index}].configuration.parserConfiguration.lang`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.parserConfiguration?.lang : '',
                })(
                  <Radio.Group buttonStyle="solid" onChange={(event) => {
                    setMode(event.target.value);
                  }}>
                    <Radio.Button value="javascript">JavaScript</Radio.Button>
                    <Radio.Button value="groovy">Groovy</Radio.Button>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="解析脚本">
                {getFieldDecorator(`cluster[${index}].configuration.parserConfiguration.script`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.parserConfiguration?.script : '',
                })(
                  <AceEditor
                    mode={mode}
                    theme="eclipse"
                    name="app_code_editor"
                    key='networkShadow'
                    fontSize={14}
                    showPrintMargin
                    showGutter
                    wrapEnabled
                    highlightActiveLine  //突出活动线
                    enableSnippets  //启用代码段
                    style={{ width: '100%', height: '35vh' }}
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
            </>
          );
        case 'fixed_length':
          return (
            <Form.Item label="长度值">
              {getFieldDecorator(`cluster[${index}].configuration.parserConfiguration.size`, {
                initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.parserConfiguration?.size : '',
              })(<Input />)}
            </Form.Item>
          );
        default:
          return null;
      }
    }
  };
  const renderForm = (index: number) => {
    if (clusterType) {
      switch (dataType) {
        case 'MQTT_SERVER':
          return (
            <div>
              <Form.Item label="线程数">
                {getFieldDecorator('configuration.instance', {
                  initialValue: props.data?.configuration?.instance,
                })(<InputNumber min={1} style={{ width: '100%' }} />)}
              </Form.Item>
              <Form.Item label="HOST">
                {getFieldDecorator('configuration.host', {
                  rules:[{required:true,message:'HOST必填'}],
                  initialValue: props.data?.configuration?.host || '0.0.0.0',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="PORT">
                {getFieldDecorator('configuration.port', {
                  rules:[{required:true,message:'PORT必填'}],
                  initialValue: props.data?.configuration?.port||'1883',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="TLS">
                {getFieldDecorator('configuration.ssl', {
                  initialValue: props.data?.configuration?.ssl,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator('configuration.certId', {
                  initialValue: props.data?.configuration?.certId,
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="最大消息长度">
                {getFieldDecorator('configuration.maxMessageSize', {
                  initialValue: props.data?.configuration?.maxMessageSize || 8096,
                })(<InputNumber style={{ width: '100%' }} />)}
              </Form.Item>
            </div>
          );
        case 'MQTT_CLIENT':
          return (
            <div>
              <Form.Item label="clientId">
                {getFieldDecorator('configuration.clientId', {
                  rules:[{required:true,message:'ClientId必填'}],
                  initialValue: props.data?.configuration?.clientId,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="HOST">
                {getFieldDecorator('configuration.host', {
                  rules:[{required:true,message:'HOST必填'}],
                  initialValue: props.data?.configuration?.host || '127.0.0.1',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="PORT">
                {getFieldDecorator('configuration.port', {
                  rules:[{required:true,message:'PORT必填'}],
                  initialValue: props.data?.configuration?.port||'1883',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="TLS">
                {getFieldDecorator('configuration.ssl', {
                  initialValue: props.data?.configuration?.ssl,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator('configuration.certId', {
                  initialValue: props.data?.configuration?.certId,
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="用户名">
                {getFieldDecorator('configuration.username', {
                  initialValue: props.data?.configuration?.username,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="密码">
                {getFieldDecorator('configuration.password', {
                  initialValue: props.data?.configuration?.password,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="最大消息长度">
                {getFieldDecorator('configuration.maxMessageSize', {
                  initialValue: props.data?.configuration?.maxMessageSize || 8096,
                })(<InputNumber style={{ width: '100%' }} />)}
              </Form.Item>
            </div>
          );
        case 'TCP_SERVER':
          return (
            <div>
              <Form.Item label="开启SSL">
                {getFieldDecorator('configuration.ssl', {
                  initialValue: props.data?.configuration?.ssl,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator('configuration.certId', {
                  initialValue: props.data?.configuration?.certId,
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="HOST">
                {getFieldDecorator('configuration.host', {
                  initialValue: props.data?.configuration?.host || '0.0.0.0',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="PORT">
                {getFieldDecorator('configuration.port', {
                  initialValue: props.data?.configuration?.port,
                })(<Input />)}
              </Form.Item>

              <Form.Item label={
                <span>
                  解析方式
                  <Tooltip title="处理TCP粘拆包的方式">
                    <Icon type="question-circle-o" style={{ paddingLeft: 10 }} />
                  </Tooltip>
                </span>
              }>
                {getFieldDecorator('configuration.parserType', {
                  rules: [{ required: true, message: '请选择' }],
                  initialValue: props.data?.configuration?.parserType,
                })(
                  <Select
                    onChange={(e: string) => {
                      setTcpServerParseType(e);
                    }}
                  >
                    <Select.Option value="DIRECT">不处理</Select.Option>
                    <Select.Option value="delimited">分隔符</Select.Option>
                    <Select.Option value="script">自定义脚本</Select.Option>
                    <Select.Option value="fixed_length">固定长度</Select.Option>
                  </Select>,
                )}
              </Form.Item>
              {renderTcpServerParse(0)}
            </div>
          );
        case 'TCP_CLIENT':
          return (
            <div>
              <Form.Item label="开启SSL">
                {getFieldDecorator('configuration.ssl', {
                  initialValue: props.data?.configuration?.ssl,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator('configuration.certId', {
                  initialValue: props.data?.configuration?.certId,
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="HOST">
                {getFieldDecorator('configuration.host', {
                  initialValue: props.data?.configuration?.host || '0.0.0.0',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="PORT">
                {getFieldDecorator('configuration.port', {
                  initialValue: props.data?.configuration?.port,
                })(<Input />)}
              </Form.Item>

              <Form.Item label={
                <span>
                  解析方式
                  <Tooltip title="处理TCP粘拆包的方式">
                    <Icon type="question-circle-o" style={{ paddingLeft: 10 }} />
                  </Tooltip>
                </span>
              }>
                {getFieldDecorator('configuration.parserType', {
                  rules: [{ required: true, message: '请选择' }],
                  initialValue: props.data?.configuration?.parserType,
                })(
                  <Select
                    onChange={(e: string) => {
                      setTcpServerParseType(e);
                    }}
                  >
                    <Select.Option value="DIRECT">不处理</Select.Option>
                    <Select.Option value="delimited">分隔符</Select.Option>
                    <Select.Option value="script">自定义脚本</Select.Option>
                    <Select.Option value="fixed_length">固定长度</Select.Option>
                  </Select>,
                )}
              </Form.Item>
              {renderTcpServerParse(0)}
            </div>
          );
        case 'COAP_SERVER':
          return (
            <div>
              <Form.Item label="本地IP">
                {getFieldDecorator('configuration.address', {
                  initialValue: props.data?.configuration?.address || '0.0.0.0',
                })(<Input placeholder="0.0.0.0" />)}
              </Form.Item>
              <Form.Item label="端口">
                {getFieldDecorator('configuration.port', {
                  initialValue: props.data?.configuration?.port,
                })(<Input />)}
              </Form.Item>

              <Form.Item label="开启DTLS">
                {getFieldDecorator('configuration.enableDtls', {
                  initialValue: props.data?.configuration?.enableDtls || false,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="私钥别名">
                {getFieldDecorator('configuration.privateKeyAlias', {
                  initialValue: props.data?.configuration?.privateKeyAlias,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator('configuration.certId', {
                  initialValue: props.data?.configuration?.certId,
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </div>
          );
        case 'COAP_CLIENT':
          return (
            <div>
              <Form.Item label="URL">
                {getFieldDecorator('configuration.url', {
                  initialValue: props.data?.configuration?.url,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="超时时间">
                {getFieldDecorator('configuration.timeout', {
                  initialValue: props.data?.configuration?.timeout,
                })(<Input />)}
              </Form.Item>

              <Form.Item label="开启DTLS">
                {getFieldDecorator('configuration.enableDtls', {
                  initialValue: props.data?.configuration?.enableDtls,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator('configuration.certId', {
                  initialValue: props.data?.configuration?.certId,
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </div>
          );
        case 'HTTP_SERVER':
          return (
            <div>
              <Form.Item label="PORT">
                {getFieldDecorator('configuration.port', {
                  initialValue: props.data?.configuration?.port,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator('configuration.certId', {
                  initialValue: props.data?.configuration?.certId,
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="开启SSL">
                {getFieldDecorator('configuration.ssl', {
                  initialValue: props.data?.configuration?.ssl,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </div>
          );
        case 'HTTP_CLIENT':
          return (
            <div>
              <Form.Item label="baseUrl">
                {getFieldDecorator('configuration.baseUrl', {
                  initialValue: props.data?.configuration?.baseUrl,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator('configuration.certId', {
                  initialValue: props.data?.configuration?.certId,
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="开启SSL">
                {getFieldDecorator('configuration.ssl', {
                  initialValue: props.data?.configuration?.ssl,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="验证HOST">
                {getFieldDecorator('configuration.verifyHost', {
                  initialValue: props.data?.configuration?.verifyHost,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="信任所有证书">
                {getFieldDecorator('configuration.trustAll', {
                  initialValue: props.data?.configuration?.trustAll,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </div>
          );
        case 'WEB_SOCKET_SERVER':
          return (
            <div>
              <Form.Item label="线程数">
                {getFieldDecorator('configuration.instance', {
                  initialValue: props.data?.configuration?.instance,
                })(<InputNumber min={1} style={{ width: '100%' }} />)}
              </Form.Item>
              <Form.Item label="开启SSL">
                {getFieldDecorator('configuration.ssl', {
                  initialValue: props.data?.configuration?.ssl,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator('configuration.certId', {
                  initialValue: props.data?.configuration?.certId,
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>

              <Form.Item label="HOST">
                {getFieldDecorator('configuration.host', {
                  initialValue: props.data?.configuration?.host || '0.0.0.0',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="PORT">
                {getFieldDecorator('configuration.port', {
                  initialValue: props.data?.configuration?.port,
                })(<Input />)}
              </Form.Item>
            </div>
          );
        case 'WEB_SOCKET_CLIENT':
          return (
            <div>
              <Form.Item label="uri">
                {getFieldDecorator('configuration.uri', {
                  initialValue: props.data?.configuration?.uri,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="开启SSL">
                {getFieldDecorator('configuration.ssl', {
                  initialValue: props.data?.configuration?.ssl,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="验证HOST">
                {getFieldDecorator('configuration.verifyHost', {
                  initialValue: props.data?.configuration?.verifyHost,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator('configuration.certId', {
                  initialValue: props.data?.configuration?.certId,
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>

              <Form.Item label="HOST">
                {getFieldDecorator('configuration.host', {
                  initialValue: props.data?.configuration?.host || '0.0.0.0',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="PORT">
                {getFieldDecorator('configuration.port', {
                  initialValue: props.data?.configuration?.port,
                })(<Input />)}
              </Form.Item>
            </div>
          );
        case 'UDP':
          return (
            <div>
              <Form.Item label="开启DTLS">
                {getFieldDecorator('configuration.ssl', {
                  initialValue: props.data?.configuration?.ssl,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator('configuration.certId', {
                  initialValue: props.data?.configuration?.certId,
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>

              <Form.Item label="私钥别名">
                {getFieldDecorator('configuration.privateKeyAlias', {
                  initialValue: props.data?.configuration?.privateKeyAlias,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="远程地址">
                {getFieldDecorator('configuration.remoteAddress', {
                  initialValue: props.data?.configuration?.remoteAddress,
                })(<Input />)}
              </Form.Item>

              <Form.Item label="远程端口">
                {getFieldDecorator('configuration.remotePort', {
                  initialValue: props.data?.configuration?.remotePort,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="本地地址">
                {getFieldDecorator('configuration.localAddress', {
                  initialValue: props.data?.configuration?.localAddress,
                })(<Input />)}
              </Form.Item>

              <Form.Item label="本地端口">
                {getFieldDecorator('configuration.localPort', {
                  initialValue: props.data?.configuration?.localPort,
                })(<Input />)}
              </Form.Item>
            </div>
          );
        default:
          return null;
      }
    } else {
      switch (dataType) {
        case 'MQTT_SERVER':
          return (
            <div>
              <Form.Item label="线程数">
                {getFieldDecorator(`cluster[${index}].configuration.instance`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.instance : '',
                })(<InputNumber min={1} style={{ width: '100%' }} />)}
              </Form.Item>
              <Form.Item label="HOST">
                {getFieldDecorator(`cluster[${index}].configuration.host`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.host : '0.0.0.0',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="PORT">
                {getFieldDecorator(`cluster[${index}].configuration.port`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.port : '',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="TLS">
                {getFieldDecorator(`cluster[${index}].configuration.ssl`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.ssl : '',
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator(`cluster[${index}].configuration.certId`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.certId : '',
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="最大消息长度">
                {getFieldDecorator(`cluster[${index}].configuration.maxMessageSize`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.maxMessageSize : 8096,
                })(<InputNumber style={{ width: '100%' }} />)}
              </Form.Item>
            </div>
          );
        case 'MQTT_CLIENT':
          return (
            <div>
              <Form.Item label="clientId">
                {getFieldDecorator(`cluster[${index}].configuration.clientId`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.clientId : '',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="HOST">
                {getFieldDecorator(`cluster[${index}].configuration.host`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.host : '0.0.0.0',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="PORT">
                {getFieldDecorator(`cluster[${index}].configuration.port`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.port : '',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="TLS">
                {getFieldDecorator(`cluster[${index}].configuration.ssl`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.ssl : false,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator(`cluster[${index}].configuration.certId`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.certId : '',
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="用户名">
                {getFieldDecorator(`cluster[${index}].configuration.username`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.username : '',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="密码">
                {getFieldDecorator(`cluster[${index}].configuration.password`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.password : '',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="最大消息长度">
                {getFieldDecorator(`cluster[${index}].configuration.maxMessageSize`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.maxMessageSize : 8096,
                })(<InputNumber style={{ width: '100%' }} />)}
              </Form.Item>
            </div>
          );
        case 'TCP_SERVER':
          return (
            <div>
              <Form.Item label="开启SSL">
                {getFieldDecorator(`cluster[${index}].configuration.ssl`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.ssl : false,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator(`cluster[${index}].configuration.certId`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.certId : '',
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="HOST">
                {getFieldDecorator(`cluster[${index}].configuration.host`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.host : '0.0.0.0',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="PORT">
                {getFieldDecorator(`cluster[${index}].configuration.port`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.port : '',
                })(<Input />)}
              </Form.Item>

              <Form.Item label={
                <span>
                  解析方式
                  <Tooltip title="处理TCP粘拆包的方式">
                    <Icon type="question-circle-o" style={{ paddingLeft: 10 }} />
                  </Tooltip>
                </span>
              }>
                {getFieldDecorator(`cluster[${index}].configuration.parserType`, {
                  rules: [{ required: true, message: '请选择' }],
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.parserType : '',
                })(
                  <Select
                    onChange={(e: string) => {
                      setTcpServerParseType(e);
                    }}
                  >
                    <Select.Option value="DIRECT">不处理</Select.Option>
                    <Select.Option value="delimited">分隔符</Select.Option>
                    <Select.Option value="script">自定义脚本</Select.Option>
                    <Select.Option value="fixed_length">固定长度</Select.Option>
                  </Select>,
                )}
              </Form.Item>
              {renderTcpServerParse(index)}
            </div>
          );
        case 'TCP_CLIENT':
          return (
            <div>
              <Form.Item label="开启SSL">
                {getFieldDecorator(`cluster[${index}].configuration.ssl`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.ssl : false,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator(`cluster[${index}].configuration.certId`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.certId : '',
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="HOST">
                {getFieldDecorator(`cluster[${index}].configuration.host`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.host : '0.0.0.0',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="PORT">
                {getFieldDecorator(`cluster[${index}].configuration.port`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.port : '',
                })(<Input />)}
              </Form.Item>

              <Form.Item label={
                <span>
                  解析方式
                  <Tooltip title="处理TCP粘拆包的方式">
                    <Icon type="question-circle-o" style={{ paddingLeft: 10 }} />
                  </Tooltip>
                </span>
              }>
                {getFieldDecorator(`cluster[${index}].configuration.parserType`, {
                  rules: [{ required: true, message: '请选择' }],
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.parserType : '',
                })(
                  <Select
                    onChange={(e: string) => {
                      setTcpServerParseType(e);
                    }}
                  >
                    <Select.Option value="DIRECT">不处理</Select.Option>
                    <Select.Option value="delimited">分隔符</Select.Option>
                    <Select.Option value="script">自定义脚本</Select.Option>
                    <Select.Option value="fixed_length">固定长度</Select.Option>
                  </Select>,
                )}
              </Form.Item>
              {renderTcpServerParse(index)}
            </div>
          );
        case 'COAP_SERVER':
          return (
            <div>
              <Form.Item label="本地IP">
                {getFieldDecorator(`cluster[${index}].configuration.address`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.address : '0.0.0.0',
                })(<Input placeholder="0.0.0.0" />)}
              </Form.Item>
              <Form.Item label="端口">
                {getFieldDecorator(`cluster[${index}].configuration.port`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.port : '',
                })(<Input />)}
              </Form.Item>

              <Form.Item label="开启DTLS">
                {getFieldDecorator(`cluster[${index}].configuration.enableDtls`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.enableDtls : false,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="私钥别名">
                {getFieldDecorator(`cluster[${index}].configuration.privateKeyAlias`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.privateKeyAlias : '',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator(`cluster[${index}].configuration.certId`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.certId : '',
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </div>
          );
        case 'COAP_CLIENT':
          return (
            <div>
              <Form.Item label="URL">
                {getFieldDecorator(`cluster[${index}].configuration.url`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.url : '',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="超时时间">
                {getFieldDecorator(`cluster[${index}].configuration.timeout`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.timeout : '',
                })(<Input />)}
              </Form.Item>

              <Form.Item label="开启DTLS">
                {getFieldDecorator(`cluster[${index}].configuration.enableDtls`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.enableDtls : false,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator(`cluster[${index}].configuration.certId`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.certId : '',
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </div>
          );
        case 'HTTP_SERVER':
          return (
            <div>
              <Form.Item label="PORT">
                {getFieldDecorator(`cluster[${index}].configuration.port`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.port : '',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator(`cluster[${index}].configuration.certId`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.certId : '',
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="开启SSL">
                {getFieldDecorator(`cluster[${index}].configuration.ssl`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.ssl : false,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </div>
          );
        case 'HTTP_CLIENT':
          return (
            <div>
              <Form.Item label="baseUrl">
                {getFieldDecorator(`cluster[${index}].configuration.baseUrl`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.baseUrl : '',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator(`cluster[${index}].configuration.certId`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.certId : '',
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
              <Form.Item label="开启SSL">
                {getFieldDecorator(`cluster[${index}].configuration.ssl`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.ssl : false,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="验证HOST">
                {getFieldDecorator(`cluster[${index}].configuration.verifyHost`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.verifyHost : false,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="信任所有证书">
                {getFieldDecorator(`cluster[${index}].configuration.trustAll`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.trustAll : false,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
            </div>
          );
        case 'WEB_SOCKET_SERVER':
          return (
            <div>
              <Form.Item label="线程数">
                {getFieldDecorator(`cluster[${index}].configuration.instance`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.instance : '',
                })(<InputNumber min={1} style={{ width: '100%' }} />)}
              </Form.Item>
              <Form.Item label="开启SSL">
                {getFieldDecorator(`cluster[${index}].configuration.ssl`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.ssl : false,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator(`cluster[${index}].configuration.certId`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.certId : '',
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>

              <Form.Item label="HOST">
                {getFieldDecorator(`cluster[${index}].configuration.host`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.host : '0.0.0.0',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="PORT">
                {getFieldDecorator(`cluster[${index}].configuration.port`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.port : '',
                })(<Input />)}
              </Form.Item>
            </div>
          );
        case 'WEB_SOCKET_CLIENT':
          return (
            <div>
              <Form.Item label="uri">
                {getFieldDecorator(`cluster[${index}].configuration.uri`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.uri : '',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="开启SSL">
                {getFieldDecorator(`cluster[${index}].configuration.ssl`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.ssl : false,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="验证HOST">
                {getFieldDecorator(`cluster[${index}].configuration.verifyHost`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.verifyHost : false,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator(`cluster[${index}].configuration.certId`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.certId : '',
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>

              <Form.Item label="HOST">
                {getFieldDecorator(`cluster[${index}].configuration.host`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.host : '0.0.0.0',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="PORT">
                {getFieldDecorator(`cluster[${index}].configuration.port`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.port : '',
                })(<Input />)}
              </Form.Item>
            </div>
          );
        case 'UDP':
          return (
            <div>
              <Form.Item label="开启DTLS">
                {getFieldDecorator(`cluster[${index}].configuration.ssl`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.ssl : false,
                })(
                  <Radio.Group>
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>,
                )}
              </Form.Item>
              <Form.Item label="证书">
                {getFieldDecorator(`cluster[${index}].configuration.certId`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.certId : '',
                })(
                  <Select>
                    {certificateList.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>

              <Form.Item label="私钥别名">
                {getFieldDecorator(`cluster[${index}].configuration.privateKeyAlias`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.privateKeyAlias : '',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="远程地址">
                {getFieldDecorator(`cluster[${index}].configuration.remoteAddress`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.remoteAddress : '',
                })(<Input />)}
              </Form.Item>

              <Form.Item label="远程端口">
                {getFieldDecorator(`cluster[${index}].configuration.remotePort`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.remotePort : '',
                })(<Input />)}
              </Form.Item>
              <Form.Item label="本地地址">
                {getFieldDecorator(`cluster[${index}].configuration.localAddress`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.localAddress : '',
                })(<Input />)}
              </Form.Item>

              <Form.Item label="本地端口">
                {getFieldDecorator(`cluster[${index}].configuration.localPort`, {
                  initialValue: props.data?.cluster ? props.data?.cluster[index]?.configuration?.localPort : '',
                })(<Input />)}
              </Form.Item>
            </div>
          );
        default:
          return null;
      }
    }
  };
  const genExtra = (item: string) => (
    <DeleteOutlined
      onClick={() => {
        let a = -1
        let data: any[] = []
        clusterList.map((i, index) => {
          if (i !== item) {
            data.push(i)
          } else {
            a = index
          }
        })
        setClusterList([...data])
        let formdata = form.getFieldsValue()
        if (formdata.cluster && a !== -1) {
          formdata.cluster.splice(a, 1)
        }
        form.setFieldsValue({
          ...formdata
        })
      }}
    />
  );
  const saveData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      if (clusterType) {
        const { id } = props.data;
        let data = fileValue
        if (fileValue.cluster && fileValue.cluster.length > 0) {
          data.cluster = []
        }
        props.save({ id, ...data });
      } else {
        let data = fileValue
        data.cluster.map((item: any, index: number) => {
          item.serverId = clusterList[index]
        })
        const { id } = props.data;
        props.save({ id, ...data });
      }
    });
  };
  return (
    <Drawer
      title={`${props.data.id ? '编辑' : '新建'}网络组件`}
      visible
      onClose={() => props.close()}
      width="30VW"
    >
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} layout={'vertical'}>
        <Form.Item label="组件名称">
          {getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入组件名称' }],
            initialValue: props.data?.name,
          })(<Input />)}
        </Form.Item>
        <Form.Item label="组件类型">
          {getFieldDecorator('type', {
            rules: [{ required: true, message: '请选择组件类型' }],
            initialValue: props.data?.type,
          })(
            <Select disabled={!!props.data.id}
              onChange={(value: string) => {
                setDataType(value);
              }}
            >
              {supportsType.map(item => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        {version === 'pro' && 
          <Form.Item label="集群">
            {getFieldDecorator('shareCluster', {
              rules: [{ required: true, message: '请选择' }],
              initialValue: props.data?.shareCluster,
            })(
              <Radio.Group onChange={(e) => {
                setClusterType(e.target.value)
              }}>
                <Radio value={true}>共享配置</Radio>
                <Radio value={false}>独立配置</Radio>
              </Radio.Group>,
            )}
          </Form.Item>
        }
        {clusterType === false && version === 'pro' ?
          <div>
            <Collapse accordion expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />} defaultActiveKey={['0']} bordered={false}>
              {
                clusterList.map((item, index) => {
                  return <Collapse.Panel header={item} key={index} extra={genExtra(item)}>
                    <div>
                      {renderForm(index)}
                    </div>
                  </Collapse.Panel>
                })
              }
            </Collapse>

            <Button
              type="dashed"
              onClick={() => {
                setIsModalVisible(true);
              }}
              className={styles.newButton}
            >
              <Icon type="plus" />
          新增
        </Button>
          </div>
          :
          <div>
            {renderForm(0)}
          </div>
        }
        <Form.Item label="描述">
          {getFieldDecorator('describe', {})(<Input.TextArea rows={3} />)}
        </Form.Item>
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
            saveData();
          }}
          type="primary"
        >
          保存
        </Button>
      </div>
      {
        isModalVisible && <Add close={() => {
          setIsModalVisible(false)
        }} save={(data: string) => { handleOk(data); }} />
      }
    </Drawer>
  );
};
export default Form.create<Props>()(Save);
