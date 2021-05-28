import { Form, Icon, Input, InputNumber, Modal, Radio, Select, Tooltip } from "antd";
import { FormComponentProps } from "antd/es/form";
import React, { useEffect, useState } from "react";
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
import apis from '@/services';

interface Props extends FormComponentProps {
    data: string;
    close: Function;
    save: Function;
}

const Add: React.FC<Props> = props => {
    const {
        form: { getFieldDecorator },
        form
    } = props;


    const [supportsType, setSupportsType] = useState([]);
    const [dataType, setDataType] = useState(props.data);
    const [tcpServerParseType, setTcpServerParseType] = useState('');
    const [mode, setMode] = useState('');

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
    }, []);

    const renderTcpServerParse = () => {
        switch (tcpServerParseType) {
            case 'delimited':
                return (
                    <Form.Item label="分隔符">
                        {getFieldDecorator('configuration.parserConfiguration.delimited', {
                        })(<Input />)}
                    </Form.Item>
                );
            case 'script':
                return (
                    <>
                        <Form.Item label="脚本语言">
                            {getFieldDecorator('configuration.parserConfiguration.lang', {
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
                        })(<Input />)}
                    </Form.Item>
                );
            default:
                return null;
        }
    }

    const renderForm = () => {
        switch (dataType) {
            case 'MQTT_SERVER':
                return (
                    <div>
                        <Form.Item label="线程数">
                            {getFieldDecorator('configuration.instance', {
                            })(<InputNumber min={1} style={{ width: '100%' }} />)}
                        </Form.Item>
                        <Form.Item label="HOST">
                            {getFieldDecorator('configuration.host', {
                                rules:[{required:true,message:'HOST必填'}],
                                initialValue: '0.0.0.0',
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="PORT">
                            {getFieldDecorator('configuration.port', {
                                rules:[{required:true,message:'PORT必填'}],
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="最大消息长度">
                            {getFieldDecorator('configuration.maxMessageSize', {
                                initialValue: 8096,
                            })(<InputNumber style={{ width: '100%' }} />)}
                        </Form.Item>
                    </div>
                );
            case 'MQTT_CLIENT':
                return (
                    <div>
                        <Form.Item label="clientId">
                            {getFieldDecorator('configuration.clientId', {
                                rules:[{required:true,message:'clientId必填'}],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="HOST">
                            {getFieldDecorator('configuration.host', {
                                rules:[{required:true,message:'HOST必填'}],
                                initialValue: '127.0.0.1',
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="PORT">
                            {getFieldDecorator('configuration.port', {
                                rules:[{required:true,message:'PORT必填'}],
                                initialValue:'1883'
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="用户名">
                            {getFieldDecorator('configuration.username', {
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="密码">
                            {getFieldDecorator('configuration.password', {
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="最大消息长度">
                            {getFieldDecorator('configuration.maxMessageSize', {
                                initialValue: 8096,
                            })(<InputNumber style={{ width: '100%' }} />)}
                        </Form.Item>
                    </div>
                );
            case 'TCP_SERVER':
                return (
                    <div>
                        <Form.Item label="开启SSL">
                            {getFieldDecorator('configuration.ssl', {
                            })(
                                <Radio.Group>
                                    <Radio value>是</Radio>
                                    <Radio value={false}>否</Radio>
                                </Radio.Group>,
                            )}
                        </Form.Item>
                        <Form.Item label="HOST">
                            {getFieldDecorator('configuration.host', {
                                initialValue: '0.0.0.0',
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="PORT">
                            {getFieldDecorator('configuration.port', {
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
                                rules: [{ required: true, message: '请选择' }]
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
                        {renderTcpServerParse()}
                    </div>
                );
            case 'TCP_CLIENT':
                return (
                    <div>
                        <Form.Item label="HOST">
                            {getFieldDecorator('configuration.host', {
                                initialValue: '0.0.0.0',
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="PORT">
                            {getFieldDecorator('configuration.port', {
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
                                rules: [{ required: true, message: '请选择' }]
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
                        {renderTcpServerParse()}
                    </div>
                );
            case 'COAP_SERVER':
                return (
                    <div>
                        <Form.Item label="本地IP">
                            {getFieldDecorator('configuration.address', {
                                initialValue: '0.0.0.0',
                            })(<Input placeholder="0.0.0.0" />)}
                        </Form.Item>
                        <Form.Item label="端口">
                            {getFieldDecorator('configuration.port', {
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="私钥别名">
                            {getFieldDecorator('configuration.privateKeyAlias', {
                            })(<Input />)}
                        </Form.Item>
                    </div>
                );
            case 'COAP_CLIENT':
                return (
                    <div>
                        <Form.Item label="URL">
                            {getFieldDecorator('configuration.url', {
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="超时时间">
                            {getFieldDecorator('configuration.timeout', {
                            })(<Input />)}
                        </Form.Item>
                    </div>
                );
            case 'HTTP_SERVER':
                return (
                    <div>
                        <Form.Item label="PORT">
                            {getFieldDecorator('configuration.port', {
                            })(<Input />)}
                        </Form.Item>
                    </div>
                );
            case 'HTTP_CLIENT':
                return (
                    <div>
                        <Form.Item label="baseUrl">
                            {getFieldDecorator('configuration.baseUrl', {
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="验证HOST">
                            {getFieldDecorator('configuration.verifyHost', {
                            })(
                                <Radio.Group>
                                    <Radio value>是</Radio>
                                    <Radio value={false}>否</Radio>
                                </Radio.Group>,
                            )}
                        </Form.Item>
                        <Form.Item label="信任所有证书">
                            {getFieldDecorator('configuration.trustAll', {
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
                            })(<InputNumber min={1} style={{ width: '100%' }} />)}
                        </Form.Item>
                        <Form.Item label="HOST">
                            {getFieldDecorator('configuration.host', {
                                initialValue: '0.0.0.0',
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="PORT">
                            {getFieldDecorator('configuration.port', {
                            })(<Input />)}
                        </Form.Item>
                    </div>
                );
            case 'WEB_SOCKET_CLIENT':
                return (
                    <div>
                        <Form.Item label="uri">
                            {getFieldDecorator('configuration.uri', {
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="验证HOST">
                            {getFieldDecorator('configuration.verifyHost', {
                            })(
                                <Radio.Group>
                                    <Radio value>是</Radio>
                                    <Radio value={false}>否</Radio>
                                </Radio.Group>,
                            )}
                        </Form.Item>
                        <Form.Item label="HOST">
                            {getFieldDecorator('configuration.host', {
                                initialValue: '0.0.0.0',
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="PORT">
                            {getFieldDecorator('configuration.port', {
                            })(<Input />)}
                        </Form.Item>
                    </div>
                );
            case 'UDP':
                return (
                    <div>
                        <Form.Item label="私钥别名">
                            {getFieldDecorator('configuration.privateKeyAlias', {
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="远程地址">
                            {getFieldDecorator('configuration.remoteAddress', {
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="远程端口">
                            {getFieldDecorator('configuration.remotePort', {
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label="本地地址">
                            {getFieldDecorator('configuration.localAddress', {
                            })(<Input />)}
                        </Form.Item>

                        <Form.Item label="本地端口">
                            {getFieldDecorator('configuration.localPort', {
                            })(<Input />)}
                        </Form.Item>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <Modal
            title={'新增网络组件'}
            visible
            width={800}
            onCancel={() => { props.close() }}
            onOk={() => {
                form.validateFields((err, fileValue) => {
                    if (err) return;
                    let data = {
                        name: fileValue.name,
                        type: props.data,
                        shareCluster: true,
                        configuration: fileValue.configuration,
                        description: fileValue.description
                    }
                    props.save({ ...data });
                });
            }}
        >
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
            >
                <Form.Item label="名称">
                    {getFieldDecorator('name', {
                        rules: [{ required: true }]
                    })(
                        <Input />
                    )}
                </Form.Item>
                <Form.Item label="组件类型">
                    {getFieldDecorator('type', {
                        rules: [{ required: true, message: '请选择组件类型' }],
                        initialValue: props.data
                    })(
                        <Select disabled={!!props.data}
                            onChange={(value: string) => {
                                setDataType(value);
                            }}
                        >
                            {supportsType.map((item: any)=> (
                                <Select.Option key={item.id} value={item.id}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>,
                    )}
                </Form.Item>
                {renderForm()}
                <Form.Item key="description" label="说明">
                    {getFieldDecorator('description', {
                    })(<Input.TextArea rows={4} placeholder="请输入" />)}
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default Form.create<Props>()(Add);