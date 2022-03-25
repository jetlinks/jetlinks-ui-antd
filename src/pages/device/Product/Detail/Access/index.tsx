import { Badge, Descriptions, Empty, Table, Tooltip } from 'antd';
import { service } from '@/pages/link/AccessConfig';
import styles from './index.less';
import { useEffect, useState } from 'react';
import { productModel } from '@/pages/device/Product';
import AccessConfig from './AccessConfig';

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
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
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
    }
  }, [productModel.current]);

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
        <div className={styles.config}>
          <div className={styles.title}>
            配置概览
            <a
              style={{ marginLeft: 20 }}
              onClick={() => {
                setConfigVisible(true);
              }}
            >
              更换
            </a>
          </div>
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
        </div>
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
