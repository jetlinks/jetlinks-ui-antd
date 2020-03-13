import React, { useState, Fragment, useEffect } from 'react';
import { Descriptions } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Info from './detail/Info';
import Status from './detail/Status';
import Log from './detail/Log';
import Debugger from './detail/Debugger';
import Functions from './detail/functions';
import styles from './index.less';
import { Dispatch, ConnectState } from '@/models/connect';
import { DeviceInstance } from '../data.d';
// import encodeQueryParam from '@/utils/encodeParam';
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
  id: string;
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
    id: '',
  };
  const [activeKey, setActiveKey] = useState(initState.activeKey);
  const [data, setData] = useState(initState.data);
  // const [logs, setLogs] = useState(initState.logs);
  const [id, setId] = useState(initState.id);
  const [deviceState, setDeviceState] = useState(initState.deviceState);
  const [deviceFunction, setDeviceFunction] = useState(initState.deviceFunction);

  const [tableList, setTableList] = useState<any>({});

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

  useEffect(() => {
    if (pathname.indexOf('save') > 0) {
      const list = pathname.split('/');
      const tempId = list[list.length - 1];
      // getInfo();
      dispatch({
        type: 'deviceInstance/queryById',
        payload: tempId,
        callback: (response: any) => {
          if (response.status === 200) {
            const { result } = response;
            const deriveMetadata = JSON.parse(result.deriveMetadata || '{}');
            if (deriveMetadata.functions.length > 0) {
              tabList.splice(2, 0, {
                key: 'functions',
                tab: '设备功能',
              });
            }
            setTableList(tabList);
            setData({ ...result });
          }
        },
      });
      setId(tempId);
    }
    setTableList(tabList);
  }, []);

  // const handleSearchLog = (param: any) => {
  //   const params = param;
  //   params.terms = { ...params.terms, deviceId: id };
  //   dispatch({
  //     type: 'deviceInstance/queryLog',
  //     payload: encodeQueryParam(params),

  //     callback: (response: any) => {
  //       if (response.status === 200) {
  //         setLogs(response.result);
  //       }
  //     },
  //   });
  // };

  const getDeviceState = () => {
    apis.deviceInstance.runInfo(id).then(response => {
      deviceState.runInfo = response.result;
      setDeviceState({ ...deviceState });
    });
    // apis.deviceInstance.fireAlarm({ id }).then(response => {
    // })
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
        // data={logs}
        // search={(param: any) => {
        //     handleSearchLog(param)
        // }}
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
