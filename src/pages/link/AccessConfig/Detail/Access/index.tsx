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
} from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';
import { service } from '@/pages/link/AccessConfig';
import encodeQuery from '@/utils/encodeQuery';
import { useHistory } from 'umi';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';

interface Props {
  change: () => void;
  data: any;
}
const Access = (props: Props) => {
  const [form] = Form.useForm();

  const history = useHistory();

  const [current, setCurrent] = useState<number>(0);
  const [networkList, setNetworkList] = useState<any[]>([]);
  const [procotolList, setProcotolList] = useState<any[]>([]);
  const [procotolCurrent, setProcotolCurrent] = useState<string>('');
  const [networkCurrent, setNetworkCurrent] = useState<string>('');
  // const [config, setConfig] = useState<any>();

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

  const queryNetworkList = (params?: any) => {
    service.getNetworkList(MetworkTypeMapping.get(props.data?.id), params).then((resp) => {
      if (resp.status === 200) {
        setNetworkList(resp.result);
      }
    });
  };

  const queryProcotolList = (params?: any) => {
    service.getProtocolList(ProcotoleMapping.get(props.data?.id), params).then((resp) => {
      if (resp.status === 200) {
        setProcotolList(resp.result);
      }
    });
  };

  useEffect(() => {
    if (props.data) {
      queryNetworkList();
      setCurrent(0);
    }
  }, [props.data]);

  const next = () => {
    if (current === 0) {
      if (!networkCurrent) {
        message.error('请选择网络组件！');
      } else {
        queryProcotolList();
        setCurrent(current + 1);
      }
    }
    if (current === 1) {
      if (!procotolCurrent) {
        message.error('请选择消息协议！');
      } else {
        service
          .getConfigView(procotolCurrent, ProcotoleMapping.get(props.data?.id))
          .then((resp) => {
            if (resp.status === 200) {
              // setConfig(resp.result)
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

  // const columns = [
  //     {
  //         title: '姓名',
  //         dataIndex: 'name',
  //         key: 'name',
  //     },
  //     {
  //         title: '年龄',
  //         dataIndex: 'age',
  //         key: 'age',
  //     },
  //     {
  //         title: '住址',
  //         dataIndex: 'address',
  //         key: 'address',
  //     },
  //     {
  //         title: '姓名',
  //         dataIndex: 'name',
  //         key: 'name',
  //     },
  //     {
  //         title: '年龄',
  //         dataIndex: 'age',
  //         key: 'age',
  //     },
  //     {
  //         title: '住址',
  //         dataIndex: 'address',
  //         key: 'address',
  //     },
  // ];

  // const dataSource = [
  //     {
  //         key: '1',
  //         name: '胡彦斌',
  //         age: 32,
  //         address: '西湖区湖底公园1号',
  //     },
  //     {
  //         key: '2',
  //         name: '胡彦祖',
  //         age: 42,
  //         address: '西湖区湖底公园1号',
  //     },
  // ];

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
                  history.push(`${getMenuPathByCode(MENUS_CODE['link/Type/Save'])}`);
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
                        <div style={{ width: '40%' }}>
                          <div className={styles.item}>
                            {MetworkTypeMapping.get(props.data?.id)}
                          </div>
                          <div className={styles.item}>共享配置</div>
                        </div>
                        <div style={{ width: '60%' }}>
                          {item.addresses.slice(0, 2).map((i: any) => (
                            <div className={styles.item} key={i.address}>
                              公网: {i.address}
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
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{
                  height: 60,
                }}
                description={
                  <span>
                    暂无数据{' '}
                    <a
                      onClick={() => {
                        history.push(`${getMenuPathByCode(MENUS_CODE['link/Type/Save'])}`);
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
                  history.push(`${getMenuPathByCode(MENUS_CODE['link/Protocol'])}`);
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
                      <div className={styles.desc}>这里是协议包中的协议说明</div>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{
                  height: 60,
                }}
                description={
                  <span>
                    暂无数据
                    <a
                      onClick={() => {
                        history.push(`${getMenuPathByCode(MENUS_CODE['link/Protocol'])}`);
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
                <Descriptions.Item label="接入方式">{props.data?.name || ''}</Descriptions.Item>
                <Descriptions.Item>{props.data?.description || ''}</Descriptions.Item>
                <Descriptions.Item label="消息协议">
                  {procotolList.find((i) => i.id === procotolCurrent)?.name || ''}
                </Descriptions.Item>
                <Descriptions.Item>
                  {procotolList.find((i) => i.id === procotolCurrent)?.description ||
                    '----缺少描述呀----'}
                </Descriptions.Item>
                <Descriptions.Item label="网络组件">
                  {(networkList.find((i) => i.id === networkCurrent)?.addresses || []).map(
                    (item: any) => (
                      <Badge
                        key={item.address}
                        color={item.health === -1 ? 'red' : 'green'}
                        text={item.address}
                        style={{ marginLeft: '20px' }}
                      />
                    ),
                  )}
                </Descriptions.Item>
              </Descriptions>
              {/* <div>
                            <div>路由信息</div>
                            <Table dataSource={dataSource} columns={columns} pagination={false} />
                        </div> */}
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
                  const params = {
                    name: values.name,
                    description: values.description,
                    provider: props.data.id,
                    protocol: procotolCurrent,
                    transport: ProcotoleMapping.get(props.data.id),
                    channel: 'network', // 网络组件
                    channelId: networkCurrent,
                  };
                  service.save(params).then((resp: any) => {
                    if (resp.status === 200) {
                      message.success('操作成功！');
                      setCurrent(0);
                      setNetworkCurrent('');
                      setProcotolCurrent('');
                    }
                  });
                } catch (errorInfo) {
                  console.error('Failed:', errorInfo);
                }
              }}
            >
              保存
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              上一步
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Access;
