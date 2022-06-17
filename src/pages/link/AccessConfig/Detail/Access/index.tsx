import { Badge, Button, Card, Col, Empty, Form, Input, Row, Steps, Table, Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { service } from '@/pages/link/AccessConfig';
import encodeQuery from '@/utils/encodeQuery';
import { useHistory } from 'umi';
import ReactMarkdown from 'react-markdown';
import { getButtonPermission, getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { InfoCircleOutlined } from '@ant-design/icons';
import TitleComponent from '@/components/TitleComponent';
import { PermissionButton } from '@/components';
import { useDomFullHeight } from '@/hooks';
import { onlyMessage } from '@/utils/util';

interface Props {
  change: () => void;
  data: any;
  provider: any;
}

const Access = (props: Props) => {
  const [form] = Form.useForm();
  const { minHeight } = useDomFullHeight(`.access`);
  const history = useHistory();

  const [current, setCurrent] = useState<number>(0);
  const [networkList, setNetworkList] = useState<any[]>([]);
  const [procotolList, setProcotolList] = useState<any[]>([]);
  const [procotolCurrent, setProcotolCurrent] = useState<string>('');
  const [networkCurrent, setNetworkCurrent] = useState<string>('');
  const [config, setConfig] = useState<any>();
  const networkPermission = PermissionButton.usePermission('link/Type').permission;
  const protocolPermission = PermissionButton.usePermission('link/Protocol').permission;
  const [steps, setSteps] = useState<string[]>(['网络组件', '消息协议', '完成']);

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
  ProcotoleMapping.set('child-device', '');

  const queryNetworkList = (id: string, params?: any) => {
    service.getNetworkList(MetworkTypeMapping.get(id), params).then((resp) => {
      if (resp.status === 200) {
        setNetworkList(resp.result);
      }
    });
  };

  const queryProcotolList = (id?: string, params?: any) => {
    service.getProtocolList(ProcotoleMapping.get(id), params).then((resp) => {
      if (resp.status === 200) {
        setProcotolList(resp.result);
      }
    });
  };

  useEffect(() => {
    if (props.provider?.id && !props.data?.id) {
      if (props.provider?.id !== 'child-device') {
        setSteps(['网络组件', '消息协议', '完成']);
        queryNetworkList(props.provider?.id, {
          include: networkCurrent || '',
        });
        setCurrent(0);
      } else {
        setSteps(['消息协议', '完成']);
        setCurrent(1);
        queryProcotolList(props.provider?.id);
      }
    }
  }, [props.provider]);

  useEffect(() => {
    if (props.data?.id) {
      setProcotolCurrent(props.data?.protocol);
      form.setFieldsValue({
        name: props.data?.name,
        description: props.data?.description,
      });
      if (props.data?.provider !== 'child-device') {
        setCurrent(0);
        setSteps(['网络组件', '消息协议', '完成']);
        setNetworkCurrent(props.data?.channelId);
        queryNetworkList(props.data?.provider, {
          include: props.data?.channelId,
        });
      } else {
        setSteps(['消息协议', '完成']);
        setCurrent(1);
        queryProcotolList(props.data?.provider);
      }
    }
  }, [props.data]);

  const next = () => {
    if (current === 0) {
      if (!networkCurrent) {
        onlyMessage('请选择网络组件！', 'error');
      } else {
        queryProcotolList(props.provider?.id);
        setCurrent(current + 1);
      }
    }
    if (current === 1) {
      if (!procotolCurrent) {
        onlyMessage('请选择消息协议！', 'error');
      } else {
        service
          .getConfigView(procotolCurrent, ProcotoleMapping.get(props.provider?.id))
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

  const columnsMQTT: any[] = [
    {
      title: '分组',
      dataIndex: 'group',
      key: 'group',
      ellipsis: true,
      align: 'center',
      width: 100,
      onCell: (record: any, index: number) => {
        const list = (config?.routes || []).sort((a: any, b: any) => a - b) || [];
        const arr = list.filter((res: any) => {
          // 这里gpsNumber是我需要判断的字段名（相同就合并）
          return res?.group == record?.group;
        });
        if (index == 0 || list[index - 1]?.group != record?.group) {
          return { rowSpan: arr.length };
        } else {
          return { rowSpan: 0 };
        }
      },
    },
    {
      title: 'topic',
      dataIndex: 'topic',
      key: 'topic',
      render: (text: any) => (
        <Tooltip placement="topLeft" title={text}>
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '上下行',
      dataIndex: 'stream',
      key: 'stream',
      ellipsis: true,
      align: 'center',
      width: 100,
      render: (text: any, record: any) => {
        const list = [];
        if (record?.upstream) {
          list.push('上行');
        }
        if (record?.downstream) {
          list.push('下行');
        }
        return <span>{list.join(',')}</span>;
      },
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      render: (text: any) => (
        <Tooltip placement="topLeft" title={text}>
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
  ];

  const columnsHTTP: any[] = [
    {
      title: '分组',
      dataIndex: 'group',
      key: 'group',
      ellipsis: true,
      width: 100,
      onCell: (record: any, index: number) => {
        const list = (config?.routes || []).sort((a: any, b: any) => a - b) || [];
        const arr = list.filter((res: any) => {
          // 这里gpsNumber是我需要判断的字段名（相同就合并）
          return res?.group == record?.group;
        });
        if (index == 0 || list[index - 1]?.group != record?.group) {
          return { rowSpan: arr.length };
        } else {
          return { rowSpan: 0 };
        }
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      render: (text: any) => (
        <Tooltip placement="topLeft" title={text}>
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '示例',
      dataIndex: 'example',
      key: 'example',
      render: (text: any) => (
        <Tooltip placement="topLeft" title={text}>
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
    {
      title: '说明',
      dataIndex: 'description',
      key: 'description',
      render: (text: any) => (
        <Tooltip placement="topLeft" title={text}>
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {text}
          </div>
        </Tooltip>
      ),
    },
  ];

  const renderSteps = (cur: number) => {
    switch (cur) {
      case 0:
        return (
          <div>
            <div className={styles.alert}>
              <InfoCircleOutlined style={{ marginRight: 10 }} />
              选择与设备通信的网络组件
            </div>
            <div className={styles.search}>
              <Input.Search
                key={'network'}
                placeholder="请输入名称"
                onSearch={(value: string) => {
                  queryNetworkList(
                    props.provider?.id,
                    encodeQuery({
                      include: networkCurrent || '',
                      terms: {
                        name$LIKE: `%${value}%`,
                      },
                    }),
                  );
                }}
                style={{ width: 500, margin: '20px 0' }}
              />
              <PermissionButton
                isPermission={networkPermission.add}
                onClick={() => {
                  const url = getMenuPathByCode(MENUS_CODE['link/Type/Detail']);
                  const tab: any = window.open(`${origin}/#${url}`);
                  tab!.onTabSaveSuccess = (value: any) => {
                    if (value.status === 200) {
                      queryNetworkList(props.provider?.id, {
                        include: networkCurrent || '',
                      });
                    }
                  };
                }}
                key="button"
                type="primary"
              >
                新增
              </PermissionButton>
            </div>
            {networkList.length > 0 ? (
              <Row gutter={[16, 16]}>
                {networkList.map((item) => (
                  <Col key={item.id} span={8}>
                    <Card
                      className={styles.cardRender}
                      style={{
                        width: '100%',
                        borderColor:
                          networkCurrent === item.id ? 'var(--ant-primary-color-active)' : '',
                      }}
                      hoverable
                      onClick={() => {
                        setNetworkCurrent(item.id);
                      }}
                    >
                      <div className={styles.title}>{item.name || '--'}</div>
                      <div className={styles.cardContent}>
                        <div
                          style={{
                            width: '100%',
                            height: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {item.addresses.slice(0, 1).map((i: any) => (
                            <div className={styles.item} key={i.address}>
                              <Badge color={i.health === -1 ? 'red' : 'green'} text={i.address} />
                            </div>
                          ))}
                        </div>
                        <div className={styles.desc}>{item?.description || '--'}</div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty
                style={{ marginTop: '10%', marginBottom: '10%' }}
                description={
                  <span>
                    暂无数据
                    {getButtonPermission('link/Type', ['add']) ? (
                      '请联系管理员进行配置'
                    ) : (
                      <Button
                        type="link"
                        onClick={() => {
                          const url = getMenuPathByCode(MENUS_CODE['link/Type/Detail']);
                          const tab: any = window.open(`${origin}/#${url}`);
                          tab!.onTabSaveSuccess = (value: any) => {
                            if (value.status === 200) {
                              queryNetworkList(props.provider?.id, {
                                include: networkCurrent || '',
                              });
                            }
                          };
                        }}
                      >
                        创建接入方式
                      </Button>
                    )}
                  </span>
                }
              />
            )}
          </div>
        );
      case 1:
        return (
          <div>
            <div className={styles.alert}>
              <InfoCircleOutlined style={{ marginRight: 10 }} />
              使用选择的消息协议，对网络组件通信数据进行编解码、认证等操作
            </div>
            <div className={styles.search}>
              <Input.Search
                key={'protocol'}
                placeholder="请输入名称"
                onSearch={(value: string) => {
                  queryProcotolList(
                    props.provider?.id,
                    encodeQuery({
                      terms: {
                        name$LIKE: `%${value}%`,
                      },
                    }),
                  );
                }}
                style={{ width: 500, margin: '20px 0' }}
              />
              <PermissionButton
                isPermission={protocolPermission.add}
                onClick={() => {
                  const url = getMenuPathByCode(MENUS_CODE[`link/Protocol`]);
                  const tab: any = window.open(`${origin}/#${url}?save=true`);
                  tab!.onTabSaveSuccess = (resp: any) => {
                    if (resp.status === 200) {
                      queryProcotolList(props.provider?.id);
                    }
                  };
                }}
                key="button"
                type="primary"
              >
                新增
              </PermissionButton>
            </div>
            {procotolList.length > 0 ? (
              <Row gutter={[16, 16]}>
                {procotolList.map((item) => (
                  <Col key={item.id} span={8}>
                    <Card
                      className={styles.cardRender}
                      style={{
                        width: '100%',
                        borderColor:
                          procotolCurrent === item.id ? 'var(--ant-primary-color-active)' : '',
                      }}
                      hoverable
                      onClick={() => {
                        setProcotolCurrent(item.id);
                      }}
                    >
                      <div style={{ height: '45px' }}>
                        <div className={styles.title}>{item.name || '--'}</div>
                        <div className={styles.desc}>{item.description || '--'}</div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty
                style={{ marginTop: '10%', marginBottom: '10%' }}
                description={
                  <span>
                    暂无数据
                    {getButtonPermission('link/Protocol', ['add']) ? (
                      '请联系管理员进行配置'
                    ) : (
                      <Button
                        type="link"
                        onClick={() => {
                          const url = getMenuPathByCode(MENUS_CODE[`link/Protocol`]);
                          const tab: any = window.open(`${origin}/#${url}?save=true`);
                          tab!.onTabSaveSuccess = (resp: any) => {
                            if (resp.status === 200) {
                              console.log(props.provider);
                              queryProcotolList(props.provider?.id);
                            }
                          };
                        }}
                      >
                        去新增
                      </Button>
                    )}
                  </span>
                }
              />
            )}
          </div>
        );
      case 2:
        return (
          <Row gutter={24}>
            <Col span={12}>
              <div className={styles.info}>
                <TitleComponent data={'基本信息'} />
                <Form name="basic" layout="vertical" form={form}>
                  <Form.Item
                    label="名称"
                    name="name"
                    rules={[{ required: true, message: '请输入名称' }]}
                  >
                    <Input placeholder="请输入名称" />
                  </Form.Item>
                  <Form.Item name="description" label="说明">
                    <Input.TextArea showCount maxLength={200} placeholder="请输入说明" />
                  </Form.Item>
                </Form>
                <div className={styles.action} style={{ marginTop: 50 }}>
                  <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                    上一步
                  </Button>
                  <Button
                    type="primary"
                    disabled={
                      !!props.data.id
                        ? getButtonPermission('link/AccessConfig', ['update'])
                        : getButtonPermission('link/AccessConfig', ['add'])
                    }
                    onClick={async () => {
                      try {
                        const values = await form.validateFields();
                        // 编辑还是保存
                        if (!props.data?.id) {
                          service
                            .save({
                              name: values.name,
                              description: values.description,
                              provider: props.provider.id,
                              protocol: procotolCurrent,
                              transport:
                                props.provider?.id === 'child-device'
                                  ? 'Gateway'
                                  : ProcotoleMapping.get(props.provider.id),
                              channel: 'network', // 网络组件
                              channelId: networkCurrent,
                            })
                            .then((resp: any) => {
                              if (resp.status === 200) {
                                onlyMessage('操作成功！');
                                history.goBack();
                                if ((window as any).onTabSaveSuccess) {
                                  (window as any).onTabSaveSuccess(resp);
                                  setTimeout(() => window.close(), 300);
                                }
                              }
                            });
                        } else {
                          service
                            .update({
                              ...props.data,
                              name: values.name,
                              description: values.description,
                              protocol: procotolCurrent,
                              channel: 'network', // 网络组件
                              channelId: networkCurrent,
                            })
                            .then((resp: any) => {
                              if (resp.status === 200) {
                                onlyMessage('操作成功！');
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
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.config}>
                <div className={styles.item}>
                  <div className={styles.title}>接入方式</div>
                  <div className={styles.context}>{props.provider?.name || '--'}</div>
                  <div className={styles.context}>{props.provider?.description || '--'}</div>
                </div>
                <div className={styles.item}>
                  <div className={styles.title}>消息协议</div>
                  <div className={styles.context}>
                    {procotolList.find((i) => i.id === procotolCurrent)?.name || '--'}
                  </div>
                  {config?.document && (
                    <div className={styles.context}>
                      {<ReactMarkdown>{config?.document}</ReactMarkdown> || '--'}
                    </div>
                  )}
                </div>
                <div className={styles.item}>
                  <div className={styles.title}>网络组件</div>
                  {(networkList.find((i) => i.id === networkCurrent)?.addresses || []).length > 0
                    ? (networkList.find((i) => i.id === networkCurrent)?.addresses || []).map(
                        (item: any) => (
                          <div key={item.address}>
                            <Badge
                              color={item.health === -1 ? 'red' : 'green'}
                              text={item.address}
                              style={{ marginLeft: '20px' }}
                            />
                          </div>
                        ),
                      )
                    : '--'}
                </div>
                {config?.routes && config?.routes?.length > 0 && (
                  <div className={styles.item}>
                    <div style={{ fontWeight: '600', marginBottom: 10 }}>
                      {props.data?.provider === 'mqtt-server-gateway' ||
                      props.data?.provider === 'mqtt-client-gateway'
                        ? 'topic'
                        : 'URL信息'}
                    </div>
                    <Table
                      bordered
                      dataSource={config?.routes || []}
                      columns={config.id === 'MQTT' ? columnsMQTT : columnsHTTP}
                      pagination={false}
                      scroll={{ y: 300 }}
                    />
                  </div>
                )}
              </div>
            </Col>
          </Row>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="access" style={{ minHeight }}>
      {!props.data?.id && (
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
      )}
      <div className={styles.box}>
        <div className={styles.steps}>
          <Steps size="small" current={current}>
            {steps.map((item) => (
              <Steps.Step key={item} title={item} />
            ))}
          </Steps>
        </div>
        <div className={styles.content}>{renderSteps(current)}</div>
        <div className={styles.action}>
          {current === 1 && props.provider.id !== 'child-device' && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              上一步
            </Button>
          )}
          {(current === 0 || current === 1) && (
            <Button type="primary" onClick={() => next()}>
              下一步
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Access;
