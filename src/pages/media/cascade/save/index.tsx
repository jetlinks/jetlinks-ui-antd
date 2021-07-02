import { Col, Divider, Form, Input, InputNumber, message, Modal, Radio, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { FormComponentProps } from "antd/lib/form";
import Password from "antd/es/input/Password";
import Service from "@/pages/media/cascade/service";

interface Props extends FormComponentProps {
  data: any;
  close: Function;
}

const Save: React.FC<Props> = props => {

  const service = new Service('media/device');
  const { form: { getFieldDecorator }, form } = props;
  const [serveIdList, setServeIdList] = useState([]);
  const [sipConfigs, setSipConfigs] = useState<any>([]);
  const [mediaServerList, setMediaServerList] = useState<any[]>([]);

  useEffect(() => {

    service.mediaServer({}).subscribe((data) => {
      setMediaServerList(data);
    }, () => {
    }, () => {
    });

    setSipConfigs(props.data.sipConfigs || [
      {
        sipId: '',
        domain: '',
        stackName: '',
        charset: '',
        user: '',
        password: '',
        localAddress: '',
        remoteAddress: '',
        port: 0,
        remotePort: 0,
        publicPort: 0,
        clusterNodeId: '',
        localSipId: '',
        name: '',
        manufacturer: '',
        model: '',
        firmware: '',
        transport: '',
        registerInterval: 0,
        keepaliveInterval: 0
      }
    ]);

    service.clusterNodes().subscribe((data) => {
      setServeIdList(data);
    }, () => {
      message.error("集群节点查询失败");
    },
      () => {

      });
  }, []);

  const saveData = () => {
    form.validateFields((err, fileValue) => {
      if (err) return;
      if (props.data.id) {
        service.updateCascade(fileValue).subscribe(() => {
          props.close();
        }, () => {
          message.error("保存错误");
        },
          () => {
          });
      } else {
        service.saveCascade(fileValue).subscribe(() => {
          props.close();
        }, () => {
          message.error("保存错误");
        },
          () => {
          });
      }
    })
  };

  return (
    <Modal
      width='60VW'
      title={props.data.id ? "编辑国标级联" : "添加国标级联"}
      visible
      okText="确定"
      cancelText="取消"
      onOk={() => {
        saveData()
      }}
      onCancel={() => props.close()}
    >
      <div>
        <Form layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Row justify="space-around" gutter={24}>
            <Col span={12}>
              <Form.Item label="级联ID">
                {getFieldDecorator('id', {
                  initialValue: props.data?.id,
                  rules: [
                    { required: true, message: '请输入级联ID' },
                    { max: 20, message: '级联ID不超过20个字符' },
                    { pattern: new RegExp(/^[0-9\-]+$/, "g"), message: '级联ID只能由纯数字组成' }
                  ],
                })(
                  <Input placeholder="请输入级联ID" readOnly={!!props.data.id} />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="级联名称">
                {getFieldDecorator('name', {
                  initialValue: props.data?.name,
                  rules: [
                    { required: true, message: '请输入级联名称' },
                    { max: 200, message: '级联名称不超过200个字符' }
                  ],
                })(<Input placeholder="请输入级联名称" />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="流媒体服务">
                {getFieldDecorator('mediaServerId', {
                  initialValue: props.data?.mediaServerId,
                  rules: [
                    { required: true, message: '请选择流媒体服务' }
                  ],
                })(<Select placeholder="请选择流媒体服务">
                  {(mediaServerList || []).map(item => (
                    <Select.Option
                      key={JSON.stringify({ mediaServerId: item.id, mediaServerName: item.name })}
                      value={item.id}
                    >
                      {`${item.name}(${item.id})`}
                    </Select.Option>
                  ))}
                </Select>)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="代理视频流">
                {getFieldDecorator('proxyStream', {
                  initialValue: props.data?.proxyStream || false,
                })(<Radio.Group buttonStyle="solid">
                  <Radio.Button value={true}>启用</Radio.Button>
                  <Radio.Button value={false}>禁用</Radio.Button>
                </Radio.Group>)}
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left" dashed style={{ marginTop: -15 }}>
            <div style={{ fontWeight: 'bold' }}>信令服务配置</div>
          </Divider>
          {
            sipConfigs.map((item: any, index: number) => {
              return (
                <div key={index}
                  style={{ backgroundColor: 'rgba(192,192,192,0.1)', marginBottom: 10, paddingTop: 10 }}>
                  {/*<div style={{width: "90%", marginLeft: '5%', paddingBottom: 10, fontSize: 16}}>
                    <b>服务： {index + 1}</b>
                  </div>*/}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: "90%" }}>
                      <Row gutter={0} justify="start">
                        <Col span={12}>
                          <Form.Item label="集群节点ID">
                            {getFieldDecorator(`sipConfigs[${index}].clusterNodeId`, {
                              initialValue: item.clusterNodeId || undefined,
                              rules: [{ required: true, message: '请输入本地服务ID' }],
                            })(
                              <Select placeholder="请选择集群节点ID">
                                {(serveIdList || []).map((item: any) => (
                                  <Select.Option key={item.id} value={item.id}>{item.id}</Select.Option>
                                ))}
                              </Select>,
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="名称">
                            {getFieldDecorator(`sipConfigs[${index}].name`, {
                              initialValue: item.name || undefined,
                              rules: [
                                { required: true, message: '请输入名称' },
                                { max: 200, message: '级联名称不超过200个字符' }
                              ],
                            })(
                              <Input placeholder="请输入名称" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="SIP ID">
                            {getFieldDecorator(`sipConfigs[${index}].sipId`, {
                              initialValue: item.sipId || undefined,
                              rules: [{ required: true, message: '请输入SIP ID' }],
                            })(
                              <Input placeholder="请输入SIP ID" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="SIP 域">
                            {getFieldDecorator(`sipConfigs[${index}].domain`, {
                              initialValue: item.domain || undefined,
                              rules: [{ required: true, message: '请输入SIP 域' }],
                            })(
                              <Input placeholder="请输入SIP 域" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="SIP HOST">
                            {getFieldDecorator(`sipConfigs[${index}].remoteAddress`, {
                              initialValue: item.remoteAddress || undefined,
                              rules: [{ required: true, message: '请输入SIP HOST' }],
                            })(
                              <Input placeholder="请输入SIP HOST" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="SIP PORT">
                            {getFieldDecorator(`sipConfigs[${index}].remotePort`, {
                              initialValue: item.remotePort || undefined,
                              rules: [{ required: true, message: '请输入SIP PORT' }],
                            })(
                              <InputNumber placeholder="请输入SIP PORT" style={{ width: '100%' }} />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="SIP本地ID">
                            {getFieldDecorator(`sipConfigs[${index}].localSipId`, {
                              initialValue: item.localSipId || undefined,
                              rules: [{ required: true, message: '请输入SIP本地ID' }],
                            })(
                              <Input placeholder="请输入SIP本地ID" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="SIP本地地址">
                            {getFieldDecorator(`sipConfigs[${index}].localAddress`, {
                              initialValue: item.localAddress || undefined,
                              rules: [{ required: true, message: '请输入SIP本地地址' }],
                            })(
                              <Input placeholder="请输入SIP本地地址" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="SIP本地端口">
                            {getFieldDecorator(`sipConfigs[${index}].port`, {
                              initialValue: item.port || undefined,
                              rules: [{ required: true, message: '请输入SIP本地端口' }],
                            })(
                              <InputNumber placeholder="请输入SIP本地端口" style={{ width: '100%' }} />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="用户(User)">
                            {getFieldDecorator(`sipConfigs[${index}].user`, {
                              initialValue: item.user || undefined,
                              rules: [{ required: true, message: '请输入用户' }],
                            })(
                              <Input placeholder="请输入用户" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="接入密码">
                            {getFieldDecorator(`sipConfigs[${index}].password`, {
                              initialValue: item.password || undefined,
                              rules: [{ required: true, message: '请输入接入密码' }],
                            })(
                              <Password placeholder="请输入接入密码" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="厂商">
                            {getFieldDecorator(`sipConfigs[${index}].manufacturer`, {
                              initialValue: item.manufacturer || undefined,
                              rules: [{ required: true, message: '请输入厂商' }],
                            })(
                              <Input placeholder="请输入厂商" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="型号">
                            {getFieldDecorator(`sipConfigs[${index}].model`, {
                              initialValue: item.model || undefined,
                              rules: [{ required: true, message: '请输入型号' }],
                            })(
                              <Input placeholder="请输入型号" />
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="版本号">
                            {getFieldDecorator(`sipConfigs[${index}].firmware`, {
                              initialValue: item.firmware || undefined,
                              rules: [{ required: true, message: '请输入版本号' }],
                            })(<Input placeholder="请输入版本号" />)}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="注册间隔(秒)">
                            {getFieldDecorator(`sipConfigs[${index}].registerInterval`, {
                              initialValue: item.registerInterval || 3600,
                              rules: [{ required: true, message: '请输入注册间隔(秒)' }],
                            })(<InputNumber placeholder="请输入注册间隔(秒)" style={{ width: '100%' }} />)}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="心跳周期(秒)">
                            {getFieldDecorator(`sipConfigs[${index}].keepaliveInterval`, {
                              initialValue: item.keepaliveInterval || 60,
                              rules: [{ required: true, message: '请输入心跳周期(秒)' }],
                            })(<InputNumber placeholder="请输入心跳周期(秒)" style={{ width: '100%' }} />)}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item key="streamMode" label="传输协议">
                            {getFieldDecorator(`sipConfigs[${index}].transport`, {
                              initialValue: item.transport || 'UDP',
                              rules: [{ required: true, message: '请选择传输协议' }],
                            })(
                              <Radio.Group buttonStyle="solid">
                                <Radio.Button value="UDP">UDP</Radio.Button>
                                <Radio.Button value="TCP">TCP</Radio.Button>
                              </Radio.Group>
                            )}
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item key="charset" label="字符集">
                            {getFieldDecorator(`sipConfigs[${index}].charset`, {
                              initialValue: item.charset || 'gb2312',
                              rules: [{ required: true, message: '请选择字符集' }],
                            })(
                              <Radio.Group buttonStyle="solid">
                                <Radio.Button value="gb2312">GB2312</Radio.Button>
                                <Radio.Button value="utf-8">UTF-8</Radio.Button>
                              </Radio.Group>
                            )}
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                    {/*<div style={{width: "10%", display: 'flex', justifyContent: 'center', marginTop: 100}}>
                      <Tooltip title="删除">
                        <MinusCircleOutlined
                          onClick={() => {
                            sipConfigs.splice(index, 1);
                            setSipConfigs([...sipConfigs]);
                          }}
                        />
                      </Tooltip>
                    </div>*/}
                  </div>
                </div>
              )
            })
          }
          {/*<Button icon="plus" type="link"
                  onClick={() => {
                    setSipConfigs([...sipConfigs, {
                      sipId: '',
                      domain: '',
                      stackName: '',
                      charset: '',
                      user: '',
                      password: '',
                      localAddress: '',
                      remoteAddress: '',
                      port: 0,
                      remotePort: 0,
                      publicPort: 0,
                      clusterNodeId: '',
                      localSipId: '',
                      name: '',
                      manufacturer: '',
                      model: '',
                      firmware: '',
                      transport: '',
                      registerInterval: 0,
                      keepaliveInterval: 0
                    }]);
                  }}
          >添加</Button>*/}
        </Form>
      </div>
    </Modal>
  )
};

export default Form.create<Props>()(Save);
