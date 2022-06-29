import { useDomFullHeight } from '@/hooks';
import {
  ExclamationCircleOutlined,
  ExpandOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Card, Tooltip, Select, Input, Button, AutoComplete, message } from 'antd';
import { useState, useRef, useEffect } from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useFullscreen, useSize } from 'ahooks';
import Service from '@/pages/device/Instance/service';
import { onlyMessage } from '@/utils/util';

interface Props {
  tag: string;
  data: any;
}

const Parsing = (props: Props) => {
  const service = new Service('device-instance');
  const { minHeight } = useDomFullHeight(`.parsing`);
  const [value, setValue] = useState(
    '//解码函数\r\n// function decode(context) {\r\n//     //原始报文\r\n//     var buffer = context.payload();\r\n//     // 转为json\r\n//     // var json = context.json();\r\n\r\n//     //mqtt 时通过此方法获取topic\r\n//     // var topic = context.topic();\r\n\r\n//     // 提取变量\r\n//     // var topicVars = context.pathVars("/{deviceId}/**",topic)\r\n//     //温度属性\r\n//     var temperature = buffer.getShort(3) * 10;\r\n//     //湿度属性\r\n//     var humidity = buffer.getShort(6) * 10;\r\n//     return {\r\n//         "temperature": temperature,\r\n//         "humidity": humidity\r\n//     };\r\n// }',
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
  const [data, setData] = useState<any>({});

  const editorDidMountHandle = (editor: any) => {
    editor.getAction('editor.action.formatDocument').run();
    monRef.current = editor;
    editor.onDidContentSizeChange?.(() => {
      editor.getAction('editor.action.formatDocument').run();
    });
  };

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
  //保存设备解析规则
  const saveDeviceCode = (productId: string, deviceId: string, datas: any) => {
    service.saveDeviceCode(productId, deviceId, datas).then((res) => {
      if (res.status === 200) {
        onlyMessage('保存成功');
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
      console.log(res.result);
    });
  };
  //获取设备解析规则
  const getDeviceCode = (productId: string, deviceId: string) => {
    service.deviceCode(productId, deviceId).then((res) => {
      if (res.status === 200) {
        // console.log(res.result)
        setValue(res.result?.configuration?.script);
        setData(res.result);
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
    }
  }, []);

  // useEffect(()=>{

  // },[])

  return (
    <Card className="parsing" style={{ minHeight }}>
      <div style={{ marginBottom: 10, color: '#8b8b8b' }}>
        <ExclamationCircleOutlined style={{ marginRight: 5 }} />
        {props.tag !== 'device' ? (
          '设备会默认继承产品的数据解析，修改设备数据解析规则后将脱离产品数据解析'
        ) : (
          <>
            {!data?.deviceId
              ? '设备数据解析已脱离产品，修改产品数据解析对该设备无影响'
              : '设备会自动继承产品的数据解析，修改设备数据解析将脱离产品'}
          </>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginRight: 10 }}>编辑脚本</div>
          <Tooltip title="编写数据解析脚本，透传类设备上报数据时会自动调用脚本将数据解析为官方格式，您可以对脚本进行模拟和运行调试，运行正常后点击“提交”，发布该脚本。">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
        <div>
          {' '}
          脚本语言:
          <Select defaultValue="JavaScript" style={{ width: 200, marginLeft: 5 }}>
            <Select.Option value="JavaScript">JavaScript(ECMAScript 5)</Select.Option>
          </Select>
          <ExpandOutlined style={{ marginLeft: 20 }} onClick={setFull} />
        </div>
      </div>
      <div ref={ref} style={{ height: 400, border: '1px solid #dcdcdc' }}>
        <MonacoEditor
          width={'100%'}
          height={'100%'}
          theme="vs-dark"
          language={'javascript'}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          editorDidMount={editorDidMountHandle}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        <div style={{ width: '49%' }}>
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
              autoSize={{ minRows: 10 }}
              placeholder="// 二进制数据以0x开头的十六进制输入，字符串数据输入原始字符串"
              style={{ marginTop: 10 }}
              onChange={(e) => {
                setSimulation(e.target.value);
              }}
            />
          </div>
        </div>
        <div style={{ width: '49%' }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, marginTop: 10 }}>运行结果</div>
            <Input.TextArea
              autoSize={{ minRows: 10 }}
              style={{ marginTop: 10 }}
              value={
                resultValue.success ? JSON.stringify(resultValue.outputs?.[0]) : resultValue.reason
              }
            />
          </div>
        </div>
      </div>
      <div style={{ marginTop: 10 }}>
        <Tooltip title="需输入脚本和模拟数据后再点击">
          <Button
            type="primary"
            loading={loading}
            disabled={!value || !simulation}
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
        <Button
          style={{ marginLeft: 10 }}
          onClick={() => {
            console.log(typeof value, value);
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
        </Button>
      </div>
    </Card>
  );
};
export default Parsing;
