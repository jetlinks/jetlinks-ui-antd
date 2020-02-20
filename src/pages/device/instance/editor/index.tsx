import { useState, Fragment, useEffect } from 'react';
import React from 'react';
import { Button, Descriptions, Statistic, message } from 'antd';
import Info from './detail/Info';
import Status from './detail/Status';
import Log from './detail/Log';
import Debugger from './detail/Debugger';
import Functions from './detail/functions';
import { router } from 'umi';
import styles from './index.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import ConnectState, { Dispatch } from '@/models/connect';
import { SimpleResponse } from '@/utils/common';
import { DeviceInstance } from '../data';
import encodeQueryParam from '@/utils/encodeParam';
import apis from '@/services';
import { response } from 'express';

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
  };
  const [activeKey, setActiveKey] = useState(initState.activeKey);
  const [data, setData] = useState(initState.data);
  const [logs, setLogs] = useState(initState.logs);
  const [id, setId] = useState();
  const [deviceState, setDeviceState] = useState(initState.deviceState);
  const [deviceFunction, setDeviceFunction] = useState(initState.deviceFunction);

  const [tableList,setTableList] = useState();

  const tabList = [
    {
      key: 'info',
      tab: '实例信息',
    },
    {
      key: 'status',
      tab: '运行状态',
    },
    /*{
      key: 'functions',
      tab: '设备功能',
    },*/
    {
      key: 'log',
      tab: '日志管理',
    },
    // {
    //     key: 'debugger',
    //     tab: '在线调试',
    // },
  ];

  const getInfo = (id: string) => {
    dispatch({
      type: 'deviceInstance/queryById',
      payload: id,
      callback: (response: SimpleResponse) => {
        if (response.status === 200) {
          let data = response.result;
          let deriveMetadata = JSON.parse(data.deriveMetadata);
          if (deriveMetadata.functions.length > 0){
            tabList.splice(2, 0, {
              key: 'functions',
              tab: '设备功能',
            });
          }
          setTableList(tabList);
          setData(data);
        }
      },
    });
  };

  useEffect(() => {
    if (pathname.indexOf('save') > 0) {
      const list = pathname.split('/');
      getInfo(list[list.length - 1]);
      setId(list[list.length - 1]);
    }
    setTableList(tabList);
  }, []);

  const handleSearchLog = (terms: any) => {
    terms.terms = { ...terms.terms, deviceId: id };
    dispatch({
      type: 'deviceInstance/queryLog',
      payload: encodeQueryParam(terms),
      // payload: encodeQueryParam({
      //     terms: terms,
      //     sorts: {
      //         field: 'createTime',
      //         order: 'desc'
      //     },
      //     pageIndex: 0,
      //     pageSize: 10,
      // }),
      callback: (response: SimpleResponse) => {
        if (response.status === 200) {
          setLogs(response.result);
        }
      },
    });
  };

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
    info: <Info data={data}/>,
    status: <Status device={data}/>,
    functions: <Functions device={data}/>,
    log: (
      <Log
        deviceId={id}
        // data={logs}
        // search={(param: any) => {
        //     handleSearchLog(param)
        // }}
      />
    ),
    debugger: <Debugger/>,
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
      title="设备:温度传感器"
      extra={action}
      content={content}
      extraContent={extra}
      tabList={tableList}
      tabActiveKey={activeKey}
      onTabChange={(key: string) => {
        // if (key === 'log') {
        //     handleSearchLog({
        //         pageIndex: 0,
        //         pageSize: 10,
        //         terms: { 'deviceId': id }
        //     })
        // } else
        if (key === 'status') {
          getDeviceState();
        } else if (key === "functions"){
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
