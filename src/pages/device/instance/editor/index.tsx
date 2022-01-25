import React, { useEffect, useState } from 'react';
import { Badge, Descriptions, Icon, message, Popconfirm, Row, Spin, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { router } from 'umi';
import Info from './detail/Info';
import Definition from './detail/Definition';
import Status from './detail/Status';
import Log from './detail/Log';
import Debugger from './detail/Debugger';
import Functions from './detail/functions';
import styles from './index.less';
import { ConnectState, Dispatch } from '@/models/connect';
import { DeviceInstance } from '@/pages/device/instance/data';
import apis from '@/services';
import Gateway from './detail/gateway';
import Alarm from '@/pages/device/alarm';
import Visualization from '../../visualization';
import { getWebsocket } from '@/layouts/GlobalWebSocket';
import Shadow from '@/pages/device/instance/editor/detail/Shadow';

interface Props {
  dispatch: Dispatch;
  location: Location;
}

interface State {
  data: Partial<DeviceInstance>;
  activeKey: string;
  logs: any;
  orgInfo: any;
  config: any;
  spinning: boolean;
}

const Editor: React.FC<Props> = props => {
  const {
    location: { pathname },
  } = props;

  const initState: State = {
    activeKey: 'info',
    data: {},
    logs: {},
    orgInfo: {},
    config: {},
    spinning: true,
  };
  const [activeKey, setActiveKey] = useState(initState.activeKey);
  const [data, setData] = useState(initState.data);
  const [id, setId] = useState();
  const [config, setConfig] = useState(initState.config);
  const [orgInfo] = useState(initState.orgInfo);
  const [spinning, setSpinning] = useState(initState.spinning);
  const [tableList, setTableList] = useState();
  const [events, setEvents] = useState<any[]>([]);
  const [functions, setFunctions] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [units, setUnits] = useState({});
  const [deviceId, setDeviceId] = useState<string | null>();
  let deviceStatus: any;

  const tabList = [
    {
      key: 'info',
      tab: '实例信息',
    },
    {
      key: 'metadata',
      tab: '物模型',
    },
    {
      key: 'log',
      tab: '日志管理',
    },
    {
      key: 'alarm',
      tab: '告警设置',
    },
    {
      key: 'visualization',
      tab: '可视化',
    },
    {
      key: 'shadow',
      tab: '设备影子',
    },
  ];

  const subscribeDeviceState = (deviceData: any, deviceId: string) => {
    deviceStatus && deviceStatus.unsubscribe();

    deviceStatus = getWebsocket(
      `instance-editor-info-status-${deviceId}`,
      `/dashboard/device/status/change/realTime`,
      {
        deviceId: deviceId,
      },
    ).subscribe((resp: any) => {
      const { payload } = resp;
      if(payload.value.type === 'online'){
        deviceData.state = { value: 'online', text: '在线' }
      } else if(payload.value.type === 'notActive'){
        deviceData.state = { value: 'notActive', text: '未启用' }
      }else if(payload.value.type === 'offline'){
        deviceData.state = {
          value: 'offline',
          text: '离线'
        }
      }
      if (payload.value.type === 'online') {
        deviceData.onlineTime = payload.timestamp;
      } else {
        deviceData.offlineTime = payload.timestamp;
      }
      setData({ ...deviceData });
    });
  };

  const getInfo = (deviceId: string) => {
    setSpinning(true);
    setDeviceId(deviceId);
    apis.deviceInstance
      .info(deviceId)
      .then((response: any) => {
        if (response.status === 200) {
          const deviceData = response.result;
          if (deviceData.orgId) {
            deviceData.orgName = orgInfo[deviceData.orgId];
          }
          setData({ ...deviceData });
          
          if (deviceData.metadata) {
            const metadata = JSON.parse(deviceData.metadata);
            setEvents(metadata.events);
            setFunctions(metadata.functions);
            setProperties(metadata.properties);
            setTags(metadata.tags);
          }
          subscribeDeviceState(deviceData, deviceId);
          if (deviceData.metadata) {
            const deriveMetadata = JSON.parse(deviceData.metadata);
            if (
              (deriveMetadata.functions || []).length > 0 &&
              deviceData.state?.value !== 'notActive'
            ) {
              tabList.splice(2, 0, {
                key: 'functions',
                tab: '设备功能',
              });
            }
          }

          if (deviceData.deviceType.value === 'gateway') {
            tabList.push({
              key: 'gateway',
              tab: '子设备管理',
            });
          }
          if (deviceData.state?.value !== 'notActive') {
            tabList.splice(1, 0, {
              key: 'status',
              tab: '运行状态',
            });
          }
          // apis.deviceProdcut.protocolConfiguration(deviceData.protocol, deviceData.transport)
          //   .then(resp => {
          //     setConfig(resp.result);
          //   }).catch();

          apis.deviceProdcut
            .deviceConfiguration(deviceData.id)
            .then(resp => {
              setConfig(resp.result);
            })
            .catch();
          setTableList(tabList);
          setSpinning(false);
        }
      })
      .catch(() => {
        setSpinning(false);
        message.error('产品物模型数据错误');
      });
  };

  const statusMap = new Map();
  statusMap.set('online', <Badge status="success" text={'在线'} />);
  statusMap.set('offline', <Badge status="error" text={'离线'} />);
  statusMap.set('notActive', <Badge status="processing" text={'未启用'} />);

  useEffect(() => {
    apis.deviceProdcut
      .queryOrganization()
      .then(res => {
        if (res.status === 200) {
          res.result.map((e: any) => (orgInfo[e.id] = e.name));
        }
      })
      .catch(() => {});
    apis.deviceProdcut
      .units()
      .then((response: any) => {
        if (response.status === 200) {
          setUnits(response.result);
        }
      })
      .catch(() => {});

    return () => {
      deviceStatus && deviceStatus.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setActiveKey('info');

    if (pathname.indexOf('save') > 0) {
      const list = pathname.split('/');
      getInfo(list[list.length - 1]);
      setId(list[list.length - 1]);
    }
    setTableList(tabList);
  }, [window.location.hash]);

  const disconnectDevice = (deviceId?: string) => {
    setSpinning(true);
    apis.deviceInstance
      .disconnectDevice(deviceId)
      .then(response => {
        if (response.status === 200) {
          message.success('断开连接成功');
          data.state = { value: 'offline', text: '离线' };
          setData(data);
          setSpinning(false);
        } else {
          message.error('断开连接失败');
          setSpinning(false);
        }
      })
      .catch();
  };

  const changeDeploy = (deviceId?: string) => {
    setSpinning(true);
    apis.deviceInstance
      .changeDeploy(deviceId)
      .then(response => {
        if (response.status === 200) {
          message.success('操作成功');
          data.state = { value: 'offline', text: '离线' };
          setData(data);
          setSpinning(false);
        } else {
          message.error('操作失败');
          setSpinning(false);
        }
      })
      .catch(() => {});
  };

  const updateData = (type: string, item: any) => {
    let metadata = JSON.stringify({ events, properties, functions, tags });
    if (type === 'event') {
      metadata = JSON.stringify({ events: item, properties, functions, tags });
    } else if (type === 'properties') {
      metadata = JSON.stringify({ events, properties: item, functions, tags });
    } else if (type === 'function') {
      metadata = JSON.stringify({ events, properties, functions: item, tags });
    } else if (type === 'tags') {
      metadata = JSON.stringify({ events, properties, functions, tags: item });
    }
    apis.deviceInstance
      .saveOrUpdateMetadata(data.id, metadata)
      .then((re: any) => {
        if (re.status === 200) {
          message.success('保存成功');
        }
      })
      .catch(() => {})
      .finally(() => {
        getInfo(deviceId!);
      });
  };

  const action = (
    <Tooltip title="刷新">
      <Icon
        type="sync"
        style={{ fontSize: 20 }}
        onClick={() => {
          getInfo(deviceId!);
        }}
      />
    </Tooltip>
  );

  const info = {
    info: (
      <Info
        data={data}
        configuration={config}
        refresh={() => {
          getInfo(data.id);
        }}
      />
    ),
    metadata: (
      <Definition
        basicInfo={data}
        eventsData={events}
        functionsData={functions}
        propertyData={properties}
        tagsData={tags}
        unitsData={units}
        saveEvents={(data: any) => {
          setEvents(data);
          updateData('event', data);
        }}
        saveFunctions={(data: any) => {
          setFunctions(data);
          updateData('function', data);
        }}
        saveProperty={(data: any[]) => {
          setProperties(data);
          updateData('properties', data);
        }}
        saveTags={(data: any[]) => {
          setTags(data);
          updateData('tags', data); //handleSearch()
        }}
        update={() => {
          getInfo(data.id);
        }}
      />
    ),
    status: (
      <Status
        device={data}
        refresh={() => {
          getInfo(data.id);
        }}
      />
    ),
    functions: <Functions device={data} />,
    log: <Log deviceId={id} />,
    debugger: <Debugger />,
    gateway: <Gateway deviceId={id} loading={false} />,
    alarm: (
      <Alarm
        target="device"
        productId={data.productId}
        productName={data.productName}
        targetId={data.id}
        metaData={data.metadata}
        name={data.name}
      />
    ),
    shadow: <Shadow deviceId={data.id} />,
    visualization: (
      <Visualization
        type="device"
        target={data.id}
        name={data.name}
        productId={data.productId}
        metaData={data.metadata}
      />
    ),
  };

  const content = (
    <div style={{ marginTop: 30 }}>
      <Descriptions column={4}>
        <Descriptions.Item label="ID">{id}</Descriptions.Item>
        <Descriptions.Item label="产品">
          <div>
            {data.productName}
            <a
              style={{ marginLeft: 10 }}
              onClick={() => {
                router.push(`/device/product/save/${data.productId}`);
              }}
            >
              查看
            </a>
          </div>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  const deviceStateStyle = {
    style: {
      fontSize: 12,
      marginLeft: 20,
    },
  };
  const titleInfo = (
    <Row>
      <div>
        <span style={{ paddingRight: 20 }}>设备：{data.name}</span>
        {statusMap.get(data.state?.value)}
        {data.state?.value === 'online' ? (
          <Popconfirm
            title="确认让此设备断开连接？"
            onConfirm={() => {
              disconnectDevice(data.id);
            }}
          >
            <a {...deviceStateStyle}>断开连接</a>
          </Popconfirm>
        ) : data.state?.value === 'notActive' ? (
          <Popconfirm
            title="确认启动此设备？"
            onConfirm={() => {
              changeDeploy(data.id);
            }}
          >
            <a {...deviceStateStyle}>启动设备</a>
          </Popconfirm>
        ) : (
          <span />
        )}
      </div>
    </Row>
  );

  const extra = <div className={styles.moreInfo} />;

  return (
    <Spin tip="加载中..." spinning={spinning}>
      <PageHeaderWrapper
        className={styles.instancePageHeader}
        style={{ marginTop: 0, backgroundColor: '#F0F2F5', paddingBottom: 10 }}
        onBack={() => window.history.back()}
        title={titleInfo}
        extra={action}
        content={content}
        extraContent={extra}
        tabList={tableList}
        tabActiveKey={activeKey}
        onTabChange={(key: string) => {
          if (!data.metadata) {
            message.error('请检查产品物模型');
            return;
          }
          setActiveKey(key);
        }}
      >
        {info[activeKey]}
      </PageHeaderWrapper>
    </Spin>
  );
};

export default connect(({ deviceInstance, loading }: ConnectState) => ({
  deviceInstance,
  loading,
}))(Editor);
