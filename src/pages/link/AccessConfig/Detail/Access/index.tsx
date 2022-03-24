import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Form,
  Input,
  message,
  Row,
  Steps,
  Table,
  Tooltip,
} from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { service } from '@/pages/link/AccessConfig';
import encodeQuery from '@/utils/encodeQuery';
import { useHistory, useLocation } from 'umi';

interface Props {
  change: () => void;
  data: any;
}

type LocationType = {
  id?: string;
};

const Access = (props: Props) => {
  const [form] = Form.useForm();

  const history = useHistory();

  const [current, setCurrent] = useState<number>(0);
  const [networkList, setNetworkList] = useState<any[]>([]);
  const [procotolList, setProcotolList] = useState<any[]>([]);
  const [access, setAccess] = useState<any>({});
  const [procotolCurrent, setProcotolCurrent] = useState<string>('');
  const [networkCurrent, setNetworkCurrent] = useState<string>('');
  const [config, setConfig] = useState<any>();
  const [providers, setProviders] = useState<any[]>([]);

  const MetworkTypeMapping = new Map();
  MetworkTypeMapping.set('websocket-server', 'WEB_SOCKET_SERVER');
  MetworkTypeMapping.set('http-server-gateway', 'HTTP_SERVER');
  MetworkTypeMapping.set('udp-device-gateway', 'UDP');
  MetworkTypeMapping.set('coap-server-gateway', 'COAP_SERVER');
  MetworkTypeMapping.set('mqtt-client-gateway', 'MQTT_CLIENT');
  MetworkTypeMapping.set('mqtt-server-gateway', 'MQTT_SERVER');
  MetworkTypeMapping.set('tcp-server-gateway', 'TCP_SERVER');

  const ProcotoleMapping = new Map();
  ProcotoleMapping.set('websocket-server', 'WebSocket');
  ProcotoleMapping.set('http-server-gateway', 'HTTP');
  ProcotoleMapping.set('udp-device-gateway', 'UDP');
  ProcotoleMapping.set('coap-server-gateway', 'COAP');
  ProcotoleMapping.set('mqtt-client-gateway', 'MQTT');
  ProcotoleMapping.set('mqtt-server-gateway', 'MQTT');
  ProcotoleMapping.set('tcp-server-gateway', 'TCP');

  const queryNetworkList = (id: string, params?: any) => {
    service.getNetworkList(MetworkTypeMapping.get(id), params).then((resp) => {
      if (resp.status === 200) {
        setNetworkList(resp.result);
      }
    });
  };

  const queryProcotolList = (id: string, params?: any) => {
    service.getProtocolList(ProcotoleMapping.get(id), params).then((resp) => {
      if (resp.status === 200) {
        setProcotolList(resp.result);
      }
    });
  };

  const queryProviders = () => {
    service.getProviders().then((resp) => {
      if (resp.status === 200) {
        setProviders(resp.result);
      }
    });
  };

  useEffect(() => {
    if (props.data?.id) {
      queryNetworkList(props.data?.id);
      setCurrent(0);
    }
  }, [props.data]);

  const location = useLocation<LocationType>();

  const params = new URLSearchParams(location.search);

  useEffect(() => {
    if (params.get('id')) {
      service.detail(params.get('id') || '').then((resp) => {
        setAccess(resp.result);
        setProcotolCurrent(resp.result?.protocol);
        setNetworkCurrent(resp.result?.channelId);
        form.setFieldsValue({
          name: resp.result?.name,
          description: resp.result?.description,
        });
        queryProviders();
        setCurrent(0);
        queryNetworkList(resp.result?.provider);
      });
    }
  }, []);

  const next = () => {
    if (current === 0) {
      if (!networkCurrent) {
        message.error('请选择网络组件！');
      } else {
        queryProcotolList(props.data?.id || access?.provider);
        setCurrent(current + 1);
      }
    }
    if (current === 1) {
      if (!procotolCurrent) {
        message.error('请选择消息协议！');
      } else {
        service
          .getConfigView(procotolCurrent, ProcotoleMapping.get(props.data?.id || access?.provider))
          .then((resp) => {
            if (resp.status === 200) {
              setConfig(resp.result);
            }
          });
        setCurrent(current + 1);
      }
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const steps = [
    {
      title: '网络组件',
    },
    {
      title: '消息协议',
    },
    {
      title: '完成',
    },
  ];

  const columnsMQTT: any[] = [
    {
      title: '分组',
      dataIndex: 'group',
      key: 'group',
      ellipsis: true,
      align: 'center',
      render: (text: any) => (
        <Tooltip placement="top" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'qos',
      dataIndex: 'qos',
      key: 'qos',
      ellipsis: true,
      align: 'center',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      align: 'center',
      render: (text: any) => (
        <Tooltip placement="top" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'topic',
      dataIndex: 'topic',
      key: 'topic',
      ellipsis: true,
      align: 'center',
      render: (text: any) => (
        <Tooltip placement="top" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      align: 'center',
      render: (text: any) => (
        <Tooltip placement="top" title={text}>
          {text}
        </Tooltip>
      ),
    },
  ];

  const columnsHTTP: any[] = [
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
      align: 'center',
      render: (text: any) => (
        <Tooltip placement="top" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: '分组',
      dataIndex: 'group',
      key: 'group',
      ellipsis: true,
      align: 'center',
      render: (text: any) => (
        <Tooltip placement="top" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: '示例',
      dataIndex: 'example',
      key: 'example',
      ellipsis: true,
      align: 'center',
      render: (text: any) => (
        <Tooltip placement="top" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      align: 'center',
      render: (text: any) => (
        <Tooltip placement="top" title={text}>
          {text}
        </Tooltip>
      ),
    },
  ];

  const renderSteps = (cur: number) => {
    switch (cur) {
      case 0:
        return (
          <div>
            <Alert message="选择与设备通信的网络组件" type="warning" showIcon />
            <div className={styles.search}>
              <Input.Search
                placeholder="请输入名称"
                onSearch={(value: string) => {
                  queryNetworkList(
                    props.data?.id || access?.provider,
                    encodeQuery({
                      terms: {
                        name$LIKE: `%${value}%`,
                      },
                    }),
                  );
                }}
                style={{ width: 500, margin: '20px 0' }}
              />
              <Button
                type="primary"
                onClick={() => {
                  const tab: any = window.open(`${origin}/#/link/Type/Save/:id`);
                  tab!.onTabSaveSuccess = (value: any) => {
                    if (value.status === 200) {
                      queryNetworkList(props.data?.id || access?.provider);
                    }
                  };
                }}
              >
                新增
              </Button>
            </div>
            {networkList.length > 0 ? (
              <Row gutter={[16, 16]}>
                {networkList.map((item) => (
                  <Col key={item.name} span={8}>
                    <Card
                      style={{
                        width: '100%',
                        border: networkCurrent === item.id ? '1px solid #1d39c4' : '',
                      }}
                      hoverable
                      onClick={() => {
                        setNetworkCurrent(item.id);
                      }}
                    >
                      <div className={styles.title}>{item.name}</div>
                      <div className={styles.cardContent}>
                        <div style={{ width: '100%', height: '50px' }}>
                          {item.addresses.slice(0, 2).map((i: any) => (
                            <div className={styles.item} key={i.address}>
                              <Badge color={i.health === -1 ? 'red' : 'green'} text={i.address} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty
                description={
                  <span>
                    暂无数据{' '}
                    <a
                      onClick={() => {
                        const tab: any = window.open(`${origin}/#/link/Type/Save/:id`);
                        tab!.onTabSaveSuccess = (value: any) => {
                          if (value.status === 200) {
                            queryNetworkList(props.data?.id || access?.provider);
                          }
                        };
                      }}
                    >
                      创建接入方式
                    </a>
                  </span>
                }
              />
            )}
          </div>
        );
      case 1:
        return (
          <div>
            <Alert
              message="使用选择的消息协议，对网络组件通信数据进行编解码、认证等操作"
              type="warning"
              showIcon
            />
            <div className={styles.search}>
              <Input.Search
                placeholder="请输入名称"
                onSearch={(value: string) => {
                  queryProcotolList(
                    props.data?.id || access?.provider,
                    encodeQuery({
                      terms: {
                        name$LIKE: `%${value}%`,
                      },
                    }),
                  );
                }}
                style={{ width: 500, margin: '20px 0' }}
              />
              <Button
                type="primary"
                onClick={() => {
                  const tab: any = window.open(`${origin}/#/link/Protocol?save=true`);
                  tab!.onTabSaveSuccess = (value: any) => {
                    if (value) {
                      queryProcotolList(props.data?.id || access?.provider);
                    }
                  };
                }}
              >
                新增
              </Button>
            </div>
            {procotolList.length > 0 ? (
              <Row gutter={[16, 16]}>
                {procotolList.map((item) => (
                  <Col key={item.name} span={8}>
                    <Card
                      style={{
                        width: '100%',
                        border: procotolCurrent === item.id ? '1px solid #1d39c4' : '',
                      }}
                      hoverable
                      onClick={() => {
                        setProcotolCurrent(item.id);
                      }}
                    >
                      <div className={styles.title}>{item.name}</div>
                      <div className={styles.desc}>{item.description}</div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty
                description={
                  <span>
                    暂无数据
                    <a
                      onClick={() => {
                        const tab: any = window.open(`${origin}/#/link/Protocol?save=true`);
                        tab!.onTabSaveSuccess = (value: any) => {
                          if (value) {
                            queryProcotolList(props.data?.id || access?.provider);
                          }
                        };
                      }}
                    >
                      去新增
                    </a>
                  </span>
                }
              />
            )}
          </div>
        );
      case 2:
        return (
          <div className={styles.view}>
            <div className={styles.info}>
              <div className={styles.title}>基本信息</div>
              <Form name="basic" layout="vertical" form={form}>
                <Form.Item
                  label="名称"
                  name="name"
                  rules={[{ required: true, message: '请输入名称' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item name="description" label="说明">
                  <Input.TextArea showCount maxLength={200} />
                </Form.Item>
              </Form>
            </div>
            <div className={styles.config}>
              <div className={styles.title}>配置概览</div>
              <Descriptions column={1}>
                <Descriptions.Item label="接入方式">
                  {props.data?.name || providers.find((i) => i.id === access?.provider)?.name}
                </Descriptions.Item>
                <Descriptions.Item>
                  {props.data?.description ||
                    providers.find((i) => i.id === access?.provider)?.description}
                </Descriptions.Item>
                <Descriptions.Item label="消息协议">
                  {procotolList.find((i) => i.id === procotolCurrent)?.name || ''}
                </Descriptions.Item>
                <Descriptions.Item>
                  {procotolList.find((i) => i.id === procotolCurrent)?.description || ''}
                </Descriptions.Item>
                <Descriptions.Item label="网络组件">
                  {(networkList.find((i) => i.id === networkCurrent)?.addresses || []).map(
                    (item: any) => (
                      <div key={item.address}>
                        <Badge
                          color={item.health === -1 ? 'red' : 'green'}
                          text={item.address}
                          style={{ marginLeft: '20px' }}
                        />
                      </div>
                    ),
                  )}
                </Descriptions.Item>
              </Descriptions>
              {config?.routes && config?.routes?.length > 0 && (
                <div>
                  <div>路由信息:</div>
                  <Table
                    dataSource={config?.routes || []}
                    columns={config.id === 'MQTT' ? columnsMQTT : columnsHTTP}
                    pagination={false}
                    scroll={{ x: 500 }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <Button
        type="link"
        onClick={() => {
          props.change();
          setNetworkCurrent('');
          setProcotolCurrent('');
        }}
      >
        返回
      </Button>
      <div className={styles.box}>
        <div className={styles.steps}>
          <Steps size="small" current={current}>
            {steps.map((item) => (
              <Steps.Step key={item.title} title={item.title} />
            ))}
          </Steps>
        </div>
        <div className={styles.content}>{renderSteps(current)}</div>
        <div className={styles.action}>
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              上一步
            </Button>
          )}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              下一步
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={async () => {
                try {
                  const values = await form.validateFields();
                  // 编辑还是保存
                  if (!params.get('id')) {
                    const param = {
                      name: values.name,
                      description: values.description,
                      provider: props.data.id,
                      protocol: procotolCurrent,
                      transport: ProcotoleMapping.get(props.data.id),
                      channel: 'network', // 网络组件
                      channelId: networkCurrent,
                    };
                    service.save(param).then((resp: any) => {
                      if (resp.status === 200) {
                        message.success('操作成功！');
                        history.goBack();
                        if ((window as any).onTabSaveSuccess) {
                          (window as any).onTabSaveSuccess(resp);
                          setTimeout(() => window.close(), 300);
                        }
                      }
                    });
                  } else {
                    const param = {
                      id: access?.id,
                      name: values.name,
                      description: values.description,
                      provider: access?.provider,
                      protocol: procotolCurrent,
                      transport: access?.transport,
                      channel: 'network', // 网络组件
                      channelId: networkCurrent,
                    };
                    service.update(param).then((resp: any) => {
                      if (resp.status === 200) {
                        message.success('操作成功！');
                        history.goBack();
                        if ((window as any).onTabSaveSuccess) {
                          (window as any).onTabSaveSuccess(resp);
                          setTimeout(() => window.close(), 300);
                        }
                      }
                    });
                  }
                } catch (errorInfo) {
                  console.error('Failed:', errorInfo);
                }
              }}
            >
              保存
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Access;
