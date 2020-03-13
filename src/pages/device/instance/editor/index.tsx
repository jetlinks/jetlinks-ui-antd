import React, { Fragment, useEffect, useState } from 'react';
import { Descriptions } from 'antd';
import Info from './detail/Info';
import Status from './detail/Status';
import Log from './detail/Log';
import Debugger from './detail/Debugger';
import Functions from './detail/functions';
import styles from './index.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import ConnectState, { Dispatch } from '@/models/connect';
import { SimpleResponse } from '@/utils/common';
import { DeviceInstance } from '../data';
import apis from '@/services';

interface Props {
  dispatch: Dispatch;
  location: Location;
}

interface State {
  data: Partial<DeviceInstance>;
  activeKey: string;
  logs: any;
  deviceState: any;
  deviceFunction: any;
  orgInfo: any;
}

const Editor: React.FC<Props> = props => {
  const {
    dispatch,
    location: { pathname },
  } = props;

  const initState: State = {
    activeKey: 'info',
    data: {},
    logs: {},
    deviceState: {},
    deviceFunction: {},
    orgInfo: {},
  };
  const [activeKey, setActiveKey] = useState(initState.activeKey);
  const [data, setData] = useState(initState.data);
  const [id, setId] = useState();
  const [deviceState, setDeviceState] = useState(initState.deviceState);
  const [deviceFunction, setDeviceFunction] = useState(initState.deviceFunction);

  const [orgInfo] = useState(initState.orgInfo);

  const [tableList, setTableList] = useState();

  const tabList = [
    {
      key: 'info',
      tab: '实例信息',
    },
    {
      key: 'status',
      tab: '运行状态',
    },
    {
      key: 'log',
      tab: '日志管理',
    },
  ];

  const getInfo = (id: string) => {
    dispatch({
      type: 'deviceInstance/queryById',
      payload: id,
      callback: (response: SimpleResponse) => {
        if (response.status === 200) {
          const data = response.result;
          if (data.orgId) {
            data.orgName = orgInfo[data.orgId];
          }
          if (data.deriveMetadata) {
            const deriveMetadata = JSON.parse(data.deriveMetadata);
            if (deriveMetadata.functions.length > 0) {
              tabList.splice(2, 0, {
                key: 'functions',
                tab: '设备功能',
              });
            }
          }
          setTableList(tabList);
          setData(data);
        }
      },
    });
  };

  useEffect(() => {

    apis.deviceProdcut
      .queryOrganization()
      .then(res => {
        if (res.status === 200) {
          res.result.map(e => (
            orgInfo[e.id] = e.name
          ));
        }
      }).catch(() => {
      });

    if (pathname.indexOf('save') > 0) {
      const list = pathname.split('/');
      getInfo(list[list.length - 1]);
      setId(list[list.length - 1]);
    }
    setTableList(tabList);
  }, []);

  const getDeviceState = () => {
    apis.deviceInstance.runInfo(id).then(response => {
      deviceState.runInfo = response.result;
      setDeviceState({ ...deviceState });
    });
  };

  const getDeviceFunctions = () => {
    apis.deviceInstance.runInfo(id).then(response => {
      deviceFunction.runInfo = response.result;
      setDeviceFunction({ ...deviceFunction });
    });
  };

  const action = (
    <Fragment>
      {/* <Button>返回</Button> */}
      {/* <Button type='primary'>刷新</Button> */}
    </Fragment>
  );

  const info = {
    info: <Info data={data} />,
    status: <Status device={data} />,
    functions: <Functions device={data} />,
    log: (
      <Log
        deviceId={id}
      />
    ),
    debugger: <Debugger />,
  };

  const content = (
    <div style={{ marginTop: 30 }}>
      <Descriptions column={4}>
        <Descriptions.Item label="ID">{id}</Descriptions.Item>
        <Descriptions.Item label="型号">
          <div>{data.productName}</div>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );

  const extra = (
    <div className={styles.moreInfo}>{/* <Statistic title="状态" value="未激活" /> */}</div>
  );

  return (
    <PageHeaderWrapper
      className={styles.instancePageHeader}
      style={{ marginTop: 0 }}
      title={`设备:${data.name}`}
      extra={action}
      content={content}
      extraContent={extra}
      tabList={tableList}
      tabActiveKey={activeKey}
      onTabChange={(key: string) => {
        if (key === 'status') {
          getDeviceState();
        } else if (key === 'functions') {
          getDeviceFunctions();
        }
        setActiveKey(key);
      }}
    >
      {info[activeKey]}
    </PageHeaderWrapper>
  );
};

export default connect(({ deviceInstance, loading }: ConnectState) => ({
  deviceInstance,
  loading,
}))(Editor);
