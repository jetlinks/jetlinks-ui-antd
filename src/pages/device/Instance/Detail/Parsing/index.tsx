import { useDomFullHeight } from '@/hooks';
import { ExclamationCircleOutlined, ExpandOutlined } from '@ant-design/icons';
import { Card, Tooltip, Select, Input, Button, AutoComplete, message } from 'antd';
import { useState, useRef, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useFullscreen, useSize } from 'ahooks';
import Service from '@/pages/device/Instance/service';
import { onlyMessage } from '@/utils/util';
import { PermissionButton } from '@/components';

interface Props {
  tag: string;
  data: any;
}

const Parsing = (props: Props) => {
  const service = new Service('device-instance');
  const { minHeight } = useDomFullHeight(`.parsing`);
  const { permission } = PermissionButton.usePermission('device/Instance');
  const [value, setValue] = useState(
    '//解码函数\r\nfunction decode(context) {\r\n    //原始报文\r\n    var buffer = context.payload();\r\n    // 转为json\r\n    // var json = context.json();\r\n    //mqtt 时通过此方法获取topic\r\n    // var topic = context.topic();\r\n\r\n    // 提取变量\r\n    // var topicVars = context.pathVars("/{deviceId}/**",topic)\r\n    //温度属性\r\n    var temperature = buffer.getShort(3) * 10;\r\n    //湿度属性\r\n    var humidity = buffer.getShort(6) * 10;\r\n    return {\r\n        "temperature": temperature,\r\n        "humidity": humidity\r\n    };\r\n}\r\n',
  );
  const ref = useRef(null);
  const size = useSize(ref);
  const monRef = useRef<any>();
  const [isFullscreen, { setFull }] = useFullscreen(ref);
  const [type, setType] = useState<string>('');
  const [topicList, setTopicList] = useState<any>([]);
  const [simulation, setSimulation] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resultValue, setResultValue] = useState<any>('');
  // const [data, setData] = useState<any>({});
  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [topTitle, setTopTitle] = useState<string>();

  const editorDidMountHandle = (editor: any) => {
    editor.getAction('editor.action.formatDocument').run();
    monRef.current = editor;
    console.log(editor);
    editor.onDidContentSizeChange?.(() => {
      editor.getAction('editor.action.formatDocument').run();
    });
  };

  // monRef.current?.languages.registerCompletionItemProvider('javascript', {
  //   provideCompletionItems() {
  //     return {
  //       suggestions: [{
  //         label: 'test()',
  //         kind: monRef.current?.languages.CompletionItemKind['Function'],
  //         insertText:'test()',
  //         detail:'sssss'
  //       }],
  //       triggerCharacters: [':']
  //     };
  //   },
  // })

  const getTopic = (id: string, transport: string) => {
    service.getProtocal(id, transport).then((res) => {
      if (res.status === 200) {
        const item = res.result.routes?.map((items: any) => ({
          value: items.topic,
        }));
        setTopicList(item);
      }
    });
  };
  //获取设备解析规则
  const getDeviceCode = (productId: string, deviceId: string) => {
    service.deviceCode(productId, deviceId).then((res) => {
      if (res.status === 200) {
        // console.log(res.result)
        if (res.result) {
          setValue(res.result?.configuration?.script);
          // setData(res.result);
        }
        if (res.result?.deviceId) {
          setReadOnly(false);
          setTopTitle('rest');
        } else {
          setReadOnly(true);
          setTopTitle('edit');
          setValue(
            '//解码函数\r\nfunction decode(context) {\r\n    //原始报文\r\n    var buffer = context.payload();\r\n    // 转为json\r\n    // var json = context.json();\r\n    //mqtt 时通过此方法获取topic\r\n    // var topic = context.topic();\r\n\r\n    // 提取变量\r\n    // var topicVars = context.pathVars("/{deviceId}/**",topic)\r\n    //温度属性\r\n    var temperature = buffer.getShort(3) * 10;\r\n    //湿度属性\r\n    var humidity = buffer.getShort(6) * 10;\r\n    return {\r\n        "temperature": temperature,\r\n        "humidity": humidity\r\n    };\r\n}\r\n',
          );
        }
      }
    });
  };
  //保存设备解析规则
  const saveDeviceCode = (productId: string, deviceId: string, datas: any) => {
    service.saveDeviceCode(productId, deviceId, datas).then((res) => {
      if (res.status === 200) {
        onlyMessage('保存成功');
        getDeviceCode(props.data.productId, props.data.id);
      }
      // console.log(res.result)
    });
  };
  //保存产品解析规则
  const saveProductCode = (productId: string, dataProduct: any) => {
    service.saveProductCode(productId, dataProduct).then((res) => {
      if (res.status === 200) {
        onlyMessage('保存成功');
      }
    });
  };

  //获取产品解析规则
  const getProductCode = (productId: string) => {
    service.productCode(productId).then((res) => {
      if (res.status === 200) {
        setValue(res.result?.configuration?.script);
      }
    });
  };
  //调试
  const test = (dataTest: any) => {
    setLoading(true);
    service.testCode(dataTest).then((res) => {
      if (res.status === 200) {
        setLoading(false);
        onlyMessage('调试成功');
        setResultValue(res?.result);
        console.log(res.result);
      } else {
        setLoading(false);
        onlyMessage('调试失败', 'error');
      }
    });
  };
  //重置
  const rest = (productId: string, deviceId: string) => {
    service.delDeviceCode(productId, deviceId).then((res) => {
      if (res.status === 200) {
        getDeviceCode(productId, deviceId);
        onlyMessage('操作成功');
      }
    });
  };

  useEffect(() => {
    if (monRef.current && size.height) {
      if (isFullscreen) {
        monRef.current.layout({
          height: document.body.clientHeight,
          width: document.body.clientWidth,
        });
      } else {
        monRef.current.layout({
          height: size.height,
          width: size.width,
        });
      }
    }
  }, [isFullscreen, size]);

  useEffect(() => {
    if (props.tag === 'device') {
      setType(props.data.transport);
      getDeviceCode(props.data.productId, props.data.id);
      getTopic(props.data.protocol, props.data.transport);
    } else {
      setType(props.data.transportProtocol);
      getProductCode(props.data.id);
      getTopic(props.data.messageProtocol, props.data.transportProtocol);
      setReadOnly(false);
    }
  }, []);

  // useEffect(() => {
  //   console.log(value);
  // }, [value]);

  return (
    <Card className="parsing" style={{ minHeight }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ color: '#a6a6a6' }}>
              {props.tag === 'device' ? (
                <>
                  <ExclamationCircleOutlined style={{ marginRight: 5 }} />
                  {topTitle === 'rest' ? (
                    <>
                      当前数据解析内容已脱离产品影响，
                      <a
                        onClick={() => {
                          rest(props.data.productId, props.data.id);
                        }}
                      >
                        重置
                      </a>
                      后将继承产品数据解析内容
                    </>
                  ) : (
                    <>
                      当前数据解析内容继承自产品，
                      <a
                        style={readOnly ? {} : { color: '#a6a6a6' }}
                        onClick={() => {
                          setReadOnly(false);
                        }}
                      >
                        修改
                      </a>
                      后将脱离产品影响。
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div>
            脚本语言:
            <Select defaultValue="JavaScript" style={{ width: 200, marginLeft: 5 }}>
              <Select.Option value="JavaScript">JavaScript(ECMAScript 5)</Select.Option>
            </Select>
            <ExpandOutlined style={{ marginLeft: 20 }} onClick={setFull} />
          </div>
        </div>
        <div ref={ref} style={{ height: 550, border: '1px solid #dcdcdc' }}>
          {readOnly && (
            <div
              onClick={() => {
                message.warning({
                  content: '请点击上方修改字样,用以编辑脚本',
                  key: 1,
                  style: {
                    marginTop: 260,
                  },
                });
              }}
              style={{
                height: 550,
                width: '97%',
                position: 'absolute',
                zIndex: 1,
                backgroundColor: '#eeeeee38',
                cursor: 'not-allowed',
              }}
            ></div>
          )}
          <MonacoEditor
            width={'100%'}
            height={'100%'}
            theme="vs"
            language={'javascript'}
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            editorDidMount={editorDidMountHandle}
            editorWillMount={(editor) => {
              editor.languages.registerCompletionItemProvider('javascript', {
                triggerCharacters: ['.'],
                provideCompletionItems(model, position) {
                  // var textUntilPosition = model.getValueInRange({
                  //   startLineNumber: 1,
                  //   startColumn: 1,
                  //   endLineNumber: position.lineNumber,
                  //   endColumn: position.column
                  // });
                  const word = model.getWordUntilPosition(position);
                  const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                  };

                  return {
                    suggestions: [
                      {
                        label: 'test()', //提示内容
                        kind: editor.languages.CompletionItemKind['Function'], //图标
                        insertText: 'test()', //填充
                        detail: '这是一个测试语法', //提示的解释
                        range: range, //范围
                      },
                    ],
                  };
                },
              });
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: 10,
            backgroundColor: '#f7f7f7',
          }}
        >
          <div style={{ width: '49.5%' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginTop: 10 }}>模拟输入</div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {type === 'MQTT' ? (
                    <>
                      <div style={{ marginRight: 5 }}>Topic:</div>
                      <AutoComplete
                        options={topicList}
                        style={{ width: 300 }}
                        allowClear
                        placeholder="请输入Topic"
                        value={topic}
                        filterOption={(inputValue, option: any) =>
                          option!.value.indexOf(inputValue) !== -1
                        }
                        onChange={(e) => {
                          setTopic(e);
                        }}
                      />
                    </>
                  ) : (
                    <>
                      <div style={{ marginRight: 5 }}>URL:</div>
                      <Input
                        placeholder="请输入URL"
                        style={{ width: 300 }}
                        value={url}
                        onChange={(e) => {
                          //    console.log(e.target.value)
                          setUrl(e.target.value);
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
              <Input.TextArea
                autoSize={{ minRows: 5 }}
                placeholder="// 二进制数据以0x开头的十六进制输入，字符串数据输入原始字符串"
                style={{ marginTop: 10 }}
                onChange={(e) => {
                  setSimulation(e.target.value);
                }}
              />
            </div>
          </div>
          <div style={{ width: '49.5%' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, marginTop: 10 }}>运行结果</div>
              <Input.TextArea
                autoSize={{ minRows: 5 }}
                style={{ marginTop: 10 }}
                value={
                  resultValue.success
                    ? JSON.stringify(resultValue.outputs?.[0])
                    : resultValue.reason
                }
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <Tooltip title="需输入脚本和模拟数据后再点击">
          <Button
            type="primary"
            loading={loading}
            disabled={value !== '' && !simulation}
            onClick={() => {
              if (type === 'MQTT') {
                if (topic !== '') {
                  test({
                    headers: {
                      topic: topic,
                    },
                    configuration: {
                      script: value,
                      lang: 'javascript',
                    },
                    provider: 'jsr223',
                    payload: simulation,
                  });
                } else {
                  message.error('请输入topic');
                }
              } else {
                if (url !== '') {
                  test({
                    headers: {
                      url: url,
                    },
                    provider: 'jsr223',
                    configuration: {
                      script: value,
                      lang: 'javascript',
                    },
                    payload: simulation,
                  });
                } else {
                  message.error('请输入url');
                }
              }
            }}
          >
            调试
          </Button>
        </Tooltip>
        <PermissionButton
          // type={'link'}
          key={'update'}
          style={{ marginLeft: 10 }}
          isPermission={permission.update}
          onClick={() => {
            if (props.tag === 'device') {
              saveDeviceCode(props.data.productId, props.data.id, {
                provider: 'jsr223',
                configuration: {
                  script: value,
                  lang: 'javascript',
                },
              });
            } else {
              saveProductCode(props.data.id, {
                provider: 'jsr223',
                configuration: {
                  script: value,
                  lang: 'javascript',
                },
              });
            }
          }}
        >
          保存
        </PermissionButton>
        {/* <Button
          style={{ marginLeft: 10 }}
          onClick={() => {
            if (props.tag === 'device') {
              saveDeviceCode(props.data.productId, props.data.id, {
                provider: 'jsr223',
                configuration: {
                  script: value,
                  lang: 'javascript',
                },
              });
            } else {
              saveProductCode(props.data.id, {
                provider: 'jsr223',
                configuration: {
                  script: value,
                  lang: 'javascript',
                },
              });
            }
          }}
        >
          保存
        </Button> */}
      </div>
    </Card>
  );
};
export default Parsing;
