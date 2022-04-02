import { Badge, Button, Col, Empty, message, Row, Table, Tooltip } from 'antd';
import { service } from '@/pages/link/AccessConfig';
import { productModel, service as productService } from '@/pages/device/Product';
import styles from './index.less';
import { useEffect, useState } from 'react';
import AccessConfig from './AccessConfig';
import ReactMarkdown from 'react-markdown';
import { Form, FormGrid, FormItem, FormLayout, Input, Password, PreviewText } from '@formily/antd';
import type { ISchema } from '@formily/json-schema';
import type { ConfigProperty } from '@/pages/device/Product/typings';
import { createSchemaField } from '@formily/react';
import { createForm } from '@formily/core';
import type { SetStateAction } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';

const componentMap = {
  string: 'Input',
  password: 'Password',
};

const Access = () => {
  const [visible, setVisible] = useState<boolean>(true);
  const [config, setConfig] = useState<any>();
  const [access, setAccess] = useState<any>();
  const [providers, setProviders] = useState<any[]>([]);
  const [networkList, setNetworkList] = useState<any[]>([]);

  const MetworkTypeMapping = new Map();
  MetworkTypeMapping.set('websocket-server', 'WEB_SOCKET_SERVER');
  MetworkTypeMapping.set('http-server-gateway', 'HTTP_SERVER');
  MetworkTypeMapping.set('udp-device-gateway', 'UDP');
  MetworkTypeMapping.set('coap-server-gateway', 'COAP_SERVER');
  MetworkTypeMapping.set('mqtt-client-gateway', 'MQTT_CLIENT');
  MetworkTypeMapping.set('mqtt-server-gateway', 'MQTT_SERVER');
  MetworkTypeMapping.set('tcp-server-gateway', 'TCP_SERVER');

  const [configVisible, setConfigVisible] = useState<boolean>(false);

  const [metadata, setMetadata] = useState<ConfigMetadata[]>([]);

  const queryNetworkList = (id: string) => {
    service.getNetworkList(MetworkTypeMapping.get(id)).then((resp) => {
      if (resp.status === 200) {
        setNetworkList(resp.result);
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

  const queryAccess = (id: string) => {
    service.queryList({ pageSize: 1000 }).then((resp) => {
      const dt = resp.result.data.find((i: any) => i.id === id);
      setAccess(dt);
      if (dt) {
        queryNetworkList(dt?.provider);
      }
    });
  };
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
      ellipsis: true,
      align: 'center',
      render: (text: any) => (
        <Tooltip placement="top" title={text}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: '上下行',
      dataIndex: 'stream',
      key: 'stream',
      ellipsis: true,
      align: 'center',
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

  const getDetail = (messageProtocol: string, transportProtocol: string) => {
    service.getConfigView(messageProtocol, transportProtocol).then((resp) => {
      if (resp.status === 200) {
        setConfig(resp.result);
      }
    });
  };

  const id = productModel.current?.id;

  useEffect(() => {
    if (id) {
      productService
        .getConfigMetadata(id)
        .then((resp: { result: SetStateAction<ConfigMetadata[]> }) => {
          setMetadata(resp.result);
        });
    }
    queryProviders();
    setVisible(!!productModel.current?.accessId);
    if (productModel.current?.accessId) {
      getDetail(
        productModel.current?.messageProtocol || '',
        productModel.current?.transportProtocol || '',
      );
      queryAccess(productModel.current?.accessId);
    }
  }, [productModel.current]);

  const form = createForm({
    validateFirst: true,
    initialValues: productModel.current?.configuration,
  });

  const SchemaField = createSchemaField({
    components: {
      Password,
      FormGrid,
      PreviewText,
      FormItem,
      Input,
    },
  });

  const configToSchema = (data: ConfigProperty[]) => {
    const obj = {};
    data.forEach((item) => {
      obj[item?.property] = {
        type: 'string',
        title: item.name,
        'x-decorator': 'FormItem',
        'x-component': componentMap[item.type.type],
        'x-decorator-props': {
          tooltip: item.description,
          gridSpan: 1,
          labelAlign: 'left',
          layout: 'vertical',
        },
      };
    });
    return obj;
  };

  const getDetailInfo = () => {
    productService.getProductDetail(id || '').subscribe((data) => {
      if (data) {
        productModel.current = {
          ...productModel.current,
          ...data,
        };
      }
    });
  };

  const renderConfigCard = () => {
    return (
      metadata &&
      metadata.length > 0 &&
      metadata?.map((item: any) => {
        const itemSchema: ISchema = {
          type: 'object',
          properties: {
            grid: {
              type: 'void',
              'x-component': 'FormGrid',
              'x-component-props': {
                maxColumns: 1,
                minColumns: 1,
                columnGap: 48,
              },
              properties: configToSchema(item.properties),
            },
          },
        };

        return (
          <PreviewText.Placeholder value="-" key={'config'}>
            <Form form={form} layout="vertical">
              <FormLayout>
                <SchemaField schema={itemSchema} />
              </FormLayout>
              <Button
                type="primary"
                onClick={async () => {
                  const values = (await form.submit()) as any;
                  const resp = await productService.modify(id || '', {
                    id,
                    configuration: { ...values },
                  });
                  if (resp.status === 200) {
                    message.success('操作成功！');
                    getDetailInfo();
                  }
                }}
              >
                保存
              </Button>
            </Form>
          </PreviewText.Placeholder>
        );
      })
    );
  };

  return (
    <div>
      {!visible ? (
        <div style={{ padding: '100px 0' }}>
          <Empty
            description={
              <span>
                请先
                <a
                  onClick={() => {
                    setConfigVisible(true);
                  }}
                >
                  选择
                </a>
                设备接入网关，用以提供设备接入能力
              </span>
            }
          />
        </div>
      ) : (
        <Row gutter={24}>
          <Col span={12}>
            <div className={styles.config}>
              <div className={styles.item}>
                <div className={styles.title}>
                  接入方式
                  <Button
                    size="small"
                    type="primary"
                    ghost
                    style={{ marginLeft: 20 }}
                    onClick={() => {
                      setConfigVisible(true);
                    }}
                  >
                    更换
                  </Button>
                </div>
                <div className={styles.context}>
                  {providers.find((i) => i.id === access?.provider)?.name || '--'}
                </div>
                <div className={styles.context}>
                  {providers.find((i) => i.id === access?.provider)?.description && (
                    <span>
                      {providers.find((i) => i.id === access?.provider)?.description || '--'}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.item}>
                <div className={styles.title}>消息协议</div>
                <div className={styles.context}>{access?.protocolDetail?.name || '--'}</div>
                <div className={styles.context}>
                  <ReactMarkdown>{config?.document || '--'}</ReactMarkdown>
                </div>
              </div>

              <div className={styles.item}>
                <div className={styles.title}>连接信息</div>
                {(networkList.find((i) => i.id === access?.channelId)?.addresses || []).length > 0
                  ? (networkList.find((i) => i.id === access?.channelId)?.addresses || []).map(
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
                  : '---'}
              </div>

              <div className={styles.item}>
                <div className={styles.title}>
                  认证配置
                  <Tooltip title="此配置来自于该产品接入方式所选择的协议">
                    <QuestionCircleOutlined />
                  </Tooltip>
                </div>
                {renderConfigCard()}
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.info}>
              {config?.routes && config?.routes?.length > 0 ? (
                <div>
                  <div style={{ fontWeight: '600', marginBottom: 10 }}>
                    {access?.provider === 'mqtt-server-gateway' ||
                    access?.provider === 'mqtt-client-gateway'
                      ? 'topic'
                      : 'URL信息'}
                  </div>
                  <Table
                    dataSource={config?.routes || []}
                    bordered
                    columns={config.id === 'MQTT' ? columnsMQTT : columnsHTTP}
                    pagination={false}
                    scroll={{ y: 500 }}
                  />
                </div>
              ) : (
                <Empty />
              )}
            </div>
          </Col>
        </Row>
      )}
      {configVisible && (
        <AccessConfig
          close={() => {
            setConfigVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default Access;
