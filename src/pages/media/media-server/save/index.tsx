import {Button, Card, Checkbox, Col, Icon, Input, InputNumber, message, Row, Select, Spin, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import Service from "../service";
import Form from "antd/es/form";
import {FormComponentProps} from "antd/lib/form";
import Section from './section';

interface Props extends FormComponentProps {
  loading: boolean
}

interface State {
  item: any;
  loading: boolean;
}

const Save: React.FC<Props> = props => {

  const initState: State = {
    item: {},
    loading: props.loading
  };

  const {form: {getFieldDecorator}, form} = props;
  const service = new Service('media/server');

  const [item, setItem] = useState(initState.item);
  const [providersList, setProvidersList] = useState<any[]>([]);
  const [providerType, setProviderType] = useState<string>('');

  const id = 'gb28181_MediaServer';
  const [loading, setLoading] = useState<boolean>(initState.loading);

  const initValue = () => {
    service.mediaServerInfo(id).subscribe(data => {
      setProviderType(data.provider);
      data.configuration.playerConfig = data.configuration.playerConfig ?
        data.configuration.playerConfig : [
          {format: 'flv', enabled: false, port: data.configuration.apiPort}, {
            format: 'mp4',
            enabled: false,
            port: data.configuration.apiPort
          }, {
            format: 'hls',
            enabled: false, port: data.configuration.apiPort
          }, {format: 'rtc', enabled: false}];
      setItem(data);
    }, () => {
      setItem({
        configuration: {
          playerConfig: [
            {format: 'flv', enabled: false}, {
              format: 'mp4',
              enabled: false
            }, {
              format: 'hls',
              enabled: false
            }, {format: 'rtc', enabled: false}]
        }
      })
    }, () => setLoading(false));

    service.providersList().subscribe(data => {
      setProvidersList(data);
    }, () => {
    }, () => setLoading(false));
  };

  useEffect(() => {
    initValue();
  }, [props.loading]);

  const saveData = () => {

    form.validateFields((err, fileValue) => {
      if (err) {
        setLoading(false);
        return;
      }

      //todo 统一界面，后期有需求就开放多网关和流媒体服务
      fileValue.id = id;
      service.saveMediaServer(fileValue).subscribe(() => {
          message.success('保存成功');
        },
        () => {
          message.error('保存失败');
        },
        () => {
          initValue();
        });
    });
  };

  const dynamic = () => {
    const configuration = item.configuration ?
      (typeof item.configuration === "string" ? JSON.parse(item.configuration) : item.configuration)
      : {};
    switch (configuration.dynamicRtpPort) {
      case true:
        return <Col span={8}>
          {getFieldDecorator('configuration.dynamicRtpPortRange', {
            rules: [
              {required: true, message: '请输入RTP端口'}
            ],
            initialValue: configuration.dynamicRtpPortRange,
          })(<Section/>)}
        </Col>;
      case false :
        return <Col span={3}>
          {getFieldDecorator('configuration.rtpPort', {
            rules: [
              {required: true, message: '请输入RTP端口'}
            ],
            initialValue: configuration.rtpPort,
          })(<InputNumber style={{width: '100%'}} placeholder='请输入RTP端口'/>)}
        </Col>;
      case undefined :
        return <Col span={3}>
          {getFieldDecorator('configuration.rtpPort', {
            rules: [
              {required: true, message: '请输入RTP端口'}
            ],
            initialValue: configuration.rtpPort,
          })(<InputNumber style={{width: '100%'}} placeholder='请输入RTP端口'/>)}
        </Col>;
      default:
        return null;
    }
  };

  const renderConfig = () => {
    const configuration = item.configuration ?
      (typeof item.configuration === "string" ? JSON.parse(item.configuration) : item.configuration)
      : {
        playerConfig: [
          {format: 'flv', enabled: false}, {
            format: 'mp4',
            enabled: false
          }, {
            format: 'hls',
            enabled: false
          }, {format: 'rtc', enabled: false}]
      };
    switch (providerType) {
      case 'srs-media':
        return (
          <div>
            <Row>
              <Col span={12}>
                <Form.Item label="公网 Host" labelCol={{span: 10}} wrapperCol={{span: 14}}>
                  {getFieldDecorator('configuration.publicHost', {
                    rules: [
                      {required: true, message: '请输入公网 Host'}
                    ],
                    initialValue: configuration.publicHost,
                  })(<Input placeholder='请输入公网 Host'/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="API Host" labelCol={{span: 10}} wrapperCol={{span: 14}}>
                  {getFieldDecorator('configuration.apiHost', {
                    rules: [
                      {required: true, message: '请输入API Host'}
                    ],
                    initialValue: configuration.apiHost,
                  })(<Input placeholder='请输入API Host'/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="API端口" labelCol={{span: 10}} wrapperCol={{span: 14}}>
                  {getFieldDecorator('configuration.apiPort', {
                    rules: [
                      {required: true, message: '请输入API端口'}
                    ],
                    initialValue: configuration.apiPort,
                  })(<InputNumber style={{width: '100%'}} placeholder='请输入API端口'/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="RTP端口" labelCol={{span: 10}} wrapperCol={{span: 14}}>
                  {getFieldDecorator('configuration.rtpPort', {
                    rules: [
                      {required: true, message: '请输入RTP端口'}
                    ],
                    initialValue: configuration.rtpPort,
                  })(<InputNumber style={{width: '100%'}} placeholder='请输入RTP端口'/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="HTTP端口" labelCol={{span: 10}} wrapperCol={{span: 14}}>
                  {getFieldDecorator('configuration.httpPort', {
                    rules: [
                      {required: true, message: '请输入HTTP端口'}
                    ],
                    initialValue: configuration.httpPort,
                  })(<InputNumber style={{width: '100%'}} placeholder='请输入HTTP端口'/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="RTMP端口" labelCol={{span: 10}} wrapperCol={{span: 14}}>
                  {getFieldDecorator('configuration.rtmpPort', {
                    rules: [
                      {required: true, message: '请输入RTMP端口'}
                    ],
                    initialValue: configuration.rtmpPort,
                  })(<InputNumber style={{width: '100%'}} placeholder='请输入RTMP端口'/>)}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="流媒体格式">
              {getFieldDecorator('configuration.formats', {
                rules: [
                  {required: true, message: '请选择流媒体格式'}
                ],
                initialValue: configuration.formats,
              })(<Select placeholder="请选择流媒体格式，多选" mode='multiple'>
                <Select.Option value='flv'>FLV</Select.Option>
                <Select.Option value='mp4'>MP4</Select.Option>
                <Select.Option value='hls'>HLS</Select.Option>
                <Select.Option value='ts'>TS</Select.Option>
                <Select.Option value='rtc'>RTC</Select.Option>
              </Select>)}
            </Form.Item>
            <Form.Item label="流ID前缀">
              {getFieldDecorator('configuration.streamIdPrefix', {
                initialValue: configuration.streamIdPrefix,
              })(<Input/>)}
            </Form.Item>
          </div>
        );
      case 'zlmedia':
        return (
          <div>
            <Row>
              <Col span={12}>
                <Form.Item label={
                  <span> 公网 Host&nbsp;
                    <Tooltip title={'在线播放时请求服务地址，域名或服务器IP地址，由于分屏展示需利用h2请求，请使用带证书的域名'}>
                      <Icon type="question-circle-o"/>
                    </Tooltip>
                  </span>
                } labelCol={{span: 10}} wrapperCol={{span: 14}}>
                  {getFieldDecorator('configuration.publicHost', {
                    rules: [
                      {required: true, message: '请输入公网 Host'}
                    ],
                    initialValue: configuration.publicHost,
                  })(<Input placeholder='请输入公网 Host'/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={
                  <span> API Host&nbsp;
                    <Tooltip title={'调用流媒体接口时请求的服务地址'}>
                      <Icon type="question-circle-o"/>
                    </Tooltip>
                  </span>
                } labelCol={{span: 10}} wrapperCol={{span: 14}}>
                  <Col span={16}>
                    {getFieldDecorator('configuration.apiHost', {
                      rules: [
                        {required: true, message: '请输入API Host'}
                      ],
                      initialValue: configuration.apiHost,
                    })(<Input placeholder='请输入API Host'/>)}
                  </Col>
                  <Col span={8}>
                    {getFieldDecorator('configuration.apiPort', {
                      rules: [
                        {required: true, message: '请输入API端口'}
                      ],
                      initialValue: configuration.apiPort,
                    })(<InputNumber style={{width: '100%'}} placeholder='请输入API端口'/>)}
                  </Col>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="密钥" labelCol={{span: 10}} wrapperCol={{span: 14}}>
                  {getFieldDecorator('configuration.secret', {
                    initialValue: configuration.secret,
                  })(<Input.Password placeholder='请输入密钥'/>)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="流ID前缀" labelCol={{span: 10}} wrapperCol={{span: 14}}>
                  {getFieldDecorator('configuration.streamIdPrefix', {
                    initialValue: configuration.streamIdPrefix,
                  })(<Input/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Form.Item label={
                <span> RTP IP&nbsp;
                  <Tooltip title={'视频设备将流推送到该IP地址下，部分设备仅支持IP地址，建议全是用IP地址'}>
                    <Icon type="question-circle-o"/>
                  </Tooltip>
                </span>
              } labelCol={{span: 5}} wrapperCol={{span: 19}}>
                <Col span={6} style={{paddingRight: 5}}>
                  {getFieldDecorator('configuration.rtpIp', {
                    rules: [
                      {required: true, message: '请输入RTP IP'}
                    ],
                    initialValue: configuration.apiHost,
                  })(<Input placeholder='请输入RTP IP'/>)}
                </Col>
                {dynamic()}
                <Col span={6} style={{paddingLeft: 10}}>
                  {getFieldDecorator('configuration.dynamicRtpPort', {
                    initialValue: configuration.dynamicRtpPort,
                    valuePropName: "checked"
                  })(
                    <Checkbox onChange={(data: any) => {
                      item.configuration.dynamicRtpPort = data.target.checked;
                      setItem({...item});
                    }}>动态端口</Checkbox>
                  )}
                </Col>
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label='流媒体格式'>
                <Card style={{padding: '5px 24px 5px 5px'}} bodyStyle={{padding: 0}}>
                  {
                    configuration.playerConfig?.map((val: any, index: number) => {
                      return (
                        <div key={index}>
                          <Row>
                            <Col span={1}>
                              <Form.Item style={{marginBottom: 5}}>
                                {getFieldDecorator(`configuration.playerConfig[${index}].enabled`, {
                                  initialValue: val.enabled || false,
                                  valuePropName: "checked"
                                })(
                                  <Checkbox onChange={(data: any) => {
                                    item.configuration.playerConfig[index].enabled = data.target.checked;
                                    setItem({...item})
                                  }}/>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={3}>
                              <Form.Item style={{marginBottom: 5}}>
                                {getFieldDecorator(`configuration.playerConfig[${index}].format`, {
                                  initialValue: val.format || undefined,
                                })(
                                  <Input placeholder="流媒体格式" readOnly style={{border: 'none'}}/>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item label="端口" labelCol={{span: 7}} wrapperCol={{span: 14}}
                                         style={{marginBottom: 5}}>
                                {getFieldDecorator(`configuration.playerConfig[${index}].port`, {
                                  initialValue: val.port || undefined,
                                })(
                                  <InputNumber style={{width: '100%'}} placeholder="请输入端口"
                                               disabled={!configuration.playerConfig[index].enabled}/>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={8}>
                              <Form.Item style={{marginBottom: 5}}>
                                {getFieldDecorator(`configuration.playerConfig[${index}].tls`, {
                                  initialValue: val.tls || false,
                                  valuePropName: "checked"
                                })(
                                  <Checkbox disabled={!configuration.playerConfig[index].enabled}>开启TLS</Checkbox>
                                )}
                              </Form.Item>
                            </Col>
                          </Row>
                        </div>
                      )
                    })
                  }
                </Card>
              </Form.Item>
            </Row>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Spin spinning={loading}>
      <Form labelCol={{span: 5}} wrapperCol={{span: 19}} style={{paddingRight: 20}}>
        <Row>
          <Col span={12}>
            <Form.Item key="name" label="流媒体名称" labelCol={{span: 10}} wrapperCol={{span: 14}}>
              {getFieldDecorator('name', {
                rules: [
                  {required: true, message: '请输入流媒体名称'},
                  {max: 200, message: '流媒体名称不超过200个字符'}
                ],
                initialValue: item?.name,
              })(<Input placeholder="请输入流媒体名称"/>)}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item key="provider" label="服务商" labelCol={{span: 10}} wrapperCol={{span: 14}}>
              {getFieldDecorator('provider', {
                rules: [{required: true, message: '请选择服务商'}],
                initialValue: item?.provider,
              })(
                <Select placeholder="服务商" onChange={(e: string) => {
                  setProviderType(e)
                }}>
                  {(providersList || []).map(item => (
                    <Select.Option
                      key={JSON.stringify({providerId: item.id, providerName: item.name})}
                      value={item.id}
                    >
                      {`${item.name}(${item.id})`}
                    </Select.Option>
                  ))}
                </Select>,
              )}
            </Form.Item>
          </Col>
        </Row>
        {renderConfig()}
      </Form>
      <div
        style={{
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '16px',
          background: '#fff',
          textAlign: 'right',
        }}
      >
        <Button
          onClick={() => {
            setLoading(true);
            saveData();
          }}
          type="primary"
        >
          保存
        </Button>
      </div>
    </Spin>
  )
};

export default Form.create<Props>()(Save);
