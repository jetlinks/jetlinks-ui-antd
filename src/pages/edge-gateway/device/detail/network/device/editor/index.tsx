import React, { useEffect, useState } from 'react';
import { Badge, Descriptions, Icon, message, Row, Spin, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Info from './detail/Info';
import Status from './detail/Status';
import Functions from './detail/functions';
import styles from './index.less';
import { ConnectState, Dispatch } from '@/models/connect';
import { DeviceInstance } from '@/pages/device/instance/data';
import apis from '@/services';
import Service from '../../service';
import { getWebsocket } from "@/layouts/GlobalWebSocket";

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
  const { location: { pathname }, } = props;
  const service = new Service('device-network');

  const initState: State = {
    activeKey: 'info',
    data: {},
    logs: {},
    orgInfo: {},
    config: {},
    spinning: true,
  };
  const [parantDeviceId, setParantDeviceId] = useState("");
  const [activeKey, setActiveKey] = useState(initState.activeKey);
  const [data, setData] = useState<any>(initState.data);
  const [id, setId] = useState("");
  const [config, setConfig] = useState(initState.config);
  const [orgInfo] = useState(initState.orgInfo);
  const [spinning, setSpinning] = useState(initState.spinning);
  const [tableList, setTableList] = useState<any[]>([]);
  let deviceStatus: any;

  const tabList = [
    {
      key: 'info',
      tab: '实例信息',
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
    ).subscribe(
      (resp: any) => {
        const { payload } = resp;
        deviceData.state = payload.value.type === 'online' ? { value: 'online', text: '在线' } : {
          value: 'offline',
          text: '离线'
        };
        if (payload.value.type === 'online') {
          deviceData.onlineTime = payload.timestamp;
        } else {
          deviceData.offlineTime = payload.timestamp;
        }
        setData({ ...deviceData });
      },
    );
  };

  const getInfo = (parantDeviceId: string, deviceId: string) => {
    setSpinning(true);
    service.getInstanceDetail(parantDeviceId, deviceId).subscribe(
      (res) => {
        const deviceData = res;
        if (deviceData.orgId) {
          deviceData.orgName = orgInfo[deviceData.orgId];
        }
        setData({ ...deviceData });
        subscribeDeviceState(deviceData, deviceId);
        if (deviceData.metadata) {
          const deriveMetadata = JSON.parse(deviceData.metadata);
          if ((deriveMetadata.functions || []).length > 0 && deviceData.state?.value !== 'notActive') {
            tabList.splice(2, 0, {
              key: 'functions',
              tab: '设备功能',
            });
          }
        }
        if (deviceData.state?.value !== 'notActive') {
          tabList.splice(2, 0, {
            key: 'status',
            tab: '运行状态',
          });
        }
        service.getIinstanceConfigMetadata(parantDeviceId, deviceData.id).subscribe(
          (resp) => {
            setConfig(resp);
          }
        )
        setTableList(tabList);
        setSpinning(false);
      },
      () => {
      },
      () => setSpinning(false));
  };

  const statusMap = new Map();
  statusMap.set('online', <Badge status='success' text={'在线'} />);
  statusMap.set('offline', <Badge status='error' text={'离线'} />);
  statusMap.set('notActive', <Badge status='processing' text={'未激活'} />);

  useEffect(() => {
    setActiveKey('info');

    if (pathname.indexOf('save') > 0 && pathname.indexOf('detail') > 0) {
      const list = pathname.split('/');
      setParantDeviceId(list[list.length - 3]);
      getInfo(list[list.length - 3], list[list.length - 1]);
      setId(list[list.length - 1]);
    }
    setTableList([...tabList]);
  }, [window.location.hash]);

  const disconnectDevice = (deviceId?: string) => {
    setSpinning(true);
    apis.deviceInstance.disconnectDevice(deviceId)
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
      }).catch();
  };

  const changeDeploy = (deviceId?: string) => {
    setSpinning(true);
    // apis.deviceInstance
    //   .changeDeploy(deviceId)
    //   .then(response => {
    //     if (response.status === 200) {
    //       message.success('激活成功');
    //       data.state = { value: 'offline', text: '离线' };
    //       setData(data);
    //       setSpinning(false);
    //     } else {
    //       message.error('激活失败');
    //       setSpinning(false);
    //     }
    //   })
    //   .catch(() => {
    //   });
  };

  const action = (
    <Tooltip title='刷新'>
      <Icon type="sync" style={{ fontSize: 20 }} onClick={() => {
        getInfo(parantDeviceId, data.id);
      }} />
    </Tooltip>
  );

  const info = {
    info: <Info data={data} deviceId={parantDeviceId} configuration={config} refresh={() => {
      getInfo(parantDeviceId, data.id);
    }} />,
    status: <Status device={data} refresh={() => {
      getInfo(parantDeviceId, data.id);
    }} />,
    functions: <Functions device={data} />
  };

  const content = (
    <div style={{ marginTop: 30 }}>
      <Descriptions column={4}>
        <Descriptions.Item label="ID">{id}</Descriptions.Item>
      </Descriptions>
    </div>
  );

  // const deviceStateStyle = {
  //   style: {
  //     fontSize: 12, marginLeft: 20
  //   }
  // };
  const titleInfo = (
    <Row>
      <div>
        <span style={{ paddingRight: 20 }}>
          设备：{data.name}
        </span>
        {statusMap.get(data.state?.value)}
        {/* {data.state?.value === 'online' ? (
          <Popconfirm title="确认让此设备断开连接？" onConfirm={() => {
            disconnectDevice(data.id);
          }}>
            <a {...deviceStateStyle}>断开连接</a>
          </Popconfirm>
        ) : (data.state?.value === 'notActive' ? (
          <Popconfirm title="确认激活此设备？"
            onConfirm={() => {
              changeDeploy(data.id);
            }}>
            <a {...deviceStateStyle}>激活设备</a>
          </Popconfirm>
        ) : (<span />))} */}
      </div>
    </Row>
  );

  const extra = (
    <div className={styles.moreInfo} />
  );

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
