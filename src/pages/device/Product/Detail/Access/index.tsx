import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  message,
  Pagination,
  Row,
  Table,
  Tooltip,
} from 'antd';
import { service } from '@/pages/link/AccessConfig';
import styles from './index.less';
import { useEffect, useState } from 'react';
import Service from '@/pages/device/Product/service';
import { productModel } from '@/pages/device/Product';
import type { ProColumns } from '@jetlinks/pro-table';
import SearchComponent from '@/components/SearchComponent';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { useHistory } from 'umi';

const Access = () => {
  const service1 = new Service('device-product');
  const [currrent, setCurrrent] = useState<any>({
    id: productModel.current?.accessId,
    name: productModel.current?.accessName,
    protocol: productModel.current?.messageProtocol,
    transport: productModel.current?.transportProtocol,
    protocolDetail: {
      name: productModel.current?.protocolName,
    },
  });
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

  const [param, setParam] = useState<any>({ pageSize: 10 });
  const history = useHistory();

  const columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
  ];

  const queryNetworkList = (id: string) => {
    service.getNetworkList(MetworkTypeMapping.get(id)).then((resp) => {
      if (resp.status === 200) {
        setNetworkList(resp.result);
      }
    });
  };

  const [dataSource, setDataSource] = useState<any>({
    data: [],
    pageSize: 10,
    pageIndex: 0,
    total: 0,
  });

  const handleSearch = (params: any) => {
    setParam(params);
    service
      .queryList({ ...params, sorts: [{ name: 'createTime', order: 'desc' }] })
      .then((resp) => {
        setDataSource(resp.result);
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

  const getDetail = (messageProtocol: string, transportProtocol: string) => {
    service.getConfigView(messageProtocol, transportProtocol).then((resp) => {
      if (resp.status === 200) {
        setConfig(resp.result);
      }
    });
  };

  useEffect(() => {
    queryProviders();
    setVisible(!!productModel.current?.accessId);
    if (productModel.current?.accessId) {
      getDetail(
        productModel.current?.messageProtocol || '',
        productModel.current?.transportProtocol || '',
      );
      queryAccess(productModel.current?.accessId);
    } else {
      handleSearch(param);
    }
  }, []);

  return (
    <div>
      {!visible ? (
        <div style={{ padding: '20px 0' }}>
          <Alert message="请选择使用的设备接入网关，用以提供设备接入能力" type="info" showIcon />
          <SearchComponent
            field={columns}
            pattern={'simple'}
            onSearch={(data: any) => {
              const dt = {
                pageSize: 10,
                terms: [...data.terms],
              };
              handleSearch(dt);
            }}
            onReset={() => {
              handleSearch({ pageSize: 10 });
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              history.push(`${getMenuPathByCode(MENUS_CODE['link/AccessConfig/Detail'])}`);
            }}
          >
            新增
          </Button>
          <Row gutter={[16, 16]} style={{ marginTop: 10 }}>
            {dataSource.data.map((item: any) => (
              <Col key={item.name} span={12}>
                <Card
                  style={{
                    width: '100%',
                    border: currrent?.id === item.id ? '1px solid #1d39c4' : '',
                  }}
                  hoverable
                  onClick={() => {
                    setCurrrent(item);
                  }}
                >
                  <div className={styles.box}>
                    <div className={styles.images}>{item.name}</div>
                    <div className={styles.content}>
                      <div className={styles.header}>
                        <div className={styles.top}>
                          <div className={styles.title}>{item.name}</div>
                          <div className={styles.status}>
                            <Badge
                              color={item.state.value === 'disabled' ? 'red' : 'green'}
                              text={item.state.text}
                              style={{ marginLeft: '20px' }}
                            />
                          </div>
                        </div>
                        <div className={styles.desc}>这里是接入方式的解释说明</div>
                      </div>
                      <div className={styles.container}>
                        <div className={styles.server}>
                          <div className={styles.title}>{item?.channelInfo?.name}</div>
                          <p>
                            {item.channelInfo?.addresses.map((i: any) => (
                              <div key={i.address}>
                                <Badge color={i.health === -1 ? 'red' : 'green'} text={i.address} />
                              </div>
                            ))}
                          </p>
                        </div>
                        <div className={styles.procotol}>
                          <div className={styles.title}>{item?.protocolDetail?.name}</div>
                          <p style={{ color: 'rgba(0, 0, 0, .55)' }}>{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <div style={{ display: 'flex', marginTop: 20, justifyContent: 'flex-end' }}>
            <Pagination
              showSizeChanger
              size="small"
              className={'pro-table-card-pagination'}
              total={dataSource?.total || 0}
              current={dataSource?.pageIndex + 1}
              onChange={(page, size) => {
                handleSearch({
                  ...param,
                  pageIndex: page - 1,
                  pageSize: size,
                });
              }}
              pageSizeOptions={[10, 20, 50, 100]}
              pageSize={dataSource?.pageSize}
              showTotal={(num) => {
                const minSize = dataSource?.pageIndex * dataSource?.pageSize + 1;
                const MaxSize = (dataSource?.pageIndex + 1) * dataSource?.pageSize;
                return `第 ${minSize} - ${MaxSize > num ? num : MaxSize} 条/总共 ${num} 条`;
              }}
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            <Button
              type="primary"
              onClick={() => {
                if (!!currrent) {
                  service1
                    .update({
                      ...productModel.current,
                      transportProtocol: currrent.transport,
                      protocolName: currrent.protocolDetail.name,
                      accessId: currrent.id,
                      accessName: currrent.name,
                      messageProtocol: currrent.protocol,
                    })
                    .then((resp) => {
                      if (resp.status === 200) {
                        service1.detail(productModel.current?.id || '').then((res) => {
                          if (res.status === 200) {
                            productModel.current = { ...res.result };
                            message.success('操作成功！');
                            setVisible(true);
                            getDetail(res.result.messageProtocol, res.result.transportProtocol);
                            queryAccess(res.result.accessId);
                          }
                        });
                      }
                    });
                } else {
                  message.success('请选择接入方式');
                }
              }}
            >
              保存
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.config}>
          <div className={styles.title}>配置概览</div>
          <Descriptions column={1}>
            <Descriptions.Item label="接入方式">
              {providers.find((i) => i.id === access?.provider)?.name || ''}
            </Descriptions.Item>
            <Descriptions.Item>
              {providers.find((i) => i.id === access?.provider)?.description || ''}
            </Descriptions.Item>
            <Descriptions.Item label="消息协议">
              {access?.protocolDetail?.name || ''}
            </Descriptions.Item>
            <Descriptions.Item>{access?.protocolDetail?.description || ''}</Descriptions.Item>
            <Descriptions.Item label="网络组件">
              {(networkList.find((i) => i.id === access?.channelId)?.addresses || []).map(
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

          <div style={{ marginTop: '20px' }}>
            <Button
              type="primary"
              onClick={() => {
                setVisible(false);
                handleSearch({ pageSize: 10 });
              }}
            >
              编辑
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Access;
