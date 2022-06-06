import { PermissionButton } from '@/components';
import useHistory from '@/hooks/route/useHistory';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { Col, message, Row } from 'antd';
import Body from '../components/Body';
import Guide from '../components/Guide';
import Statistics from '../components/Statistics';
// import Steps from '../components/Steps';
import { service } from '..';
import { useEffect, useState } from 'react';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import { map } from 'rxjs';
import Pie from '../components/Pie';

const Comprehensive = () => {
  const [subscribeTopic] = useSendWebsocketMessage();
  const productPermission = PermissionButton.usePermission('device/Product').permission;
  const devicePermission = PermissionButton.usePermission('device/Instance').permission;
  const rulePermission = PermissionButton.usePermission('rule-engine/Instance').permission;
  const accessPermission = getMenuPathByCode(MENUS_CODE['link/AccessConfig']);
  const logPermission = getMenuPathByCode(MENUS_CODE['Log']);
  const linkPermission = getMenuPathByCode(MENUS_CODE['link/DashBoard']);

  const [productCount, setProductCount] = useState<number>(0);
  const [deviceCount, setDeviceCount] = useState<number>(0);
  const [cpuValue, setCpuValue] = useState<number>(0);
  const [jvmValue, setJvmValue] = useState<number>(0);

  const getProductCount = async () => {
    const resp = await service.productCount({});
    if (resp.status === 200) {
      setProductCount(resp.result);
    }
  };

  const getDeviceCount = async () => {
    const resp = await service.deviceCount();
    if (resp.status === 200) {
      setDeviceCount(resp.result);
    }
  };

  useEffect(() => {
    getProductCount();
    getDeviceCount();
  }, []);

  useEffect(() => {
    const cpuRealTime = subscribeTopic!(
      `operations-statistics-system-info-cpu-realTime`,
      `/dashboard/systemMonitor/stats/info/realTime`,
      {
        type: 'cpu',
        interval: '2s',
        agg: 'avg',
      },
    )
      ?.pipe(map((res) => res.payload))
      .subscribe((payload: any) => {
        setCpuValue(payload.value?.systemUsage || 0);
      });

    const jvmRealTime = subscribeTopic!(
      `operations-statistics-system-info-memory-realTime`,
      `/dashboard/systemMonitor/stats/info/realTime`,
      {
        type: 'memory',
        interval: '2s',
        agg: 'avg',
      },
    )
      ?.pipe(map((res) => res.payload))
      .subscribe((payload: any) => {
        setJvmValue(payload.value?.jvmHeapUsage || 0);
      });

    return () => {
      cpuRealTime?.unsubscribe();
      jvmRealTime?.unsubscribe();
    };
  }, []);

  const history = useHistory();
  // // 跳转
  const guideList = [
    {
      key: 'product',
      name: '创建产品',
      english: 'CREATE PRODUCT',
      auth: !!productPermission.add,
      url: 'device/Product',
      param: {
        save: true,
      },
    },
    {
      key: 'device',
      name: '创建设备',
      english: 'CREATE DEVICE',
      auth: !!devicePermission.add,
      url: 'device/Instance',
      param: {
        save: true,
      },
    },
    {
      key: 'rule-engine',
      name: '规则引擎',
      english: 'RULE ENGINE',
      auth: !!rulePermission.add,
      url: 'rule-engine/Instance',
      param: {
        save: true,
      },
    },
  ];

  const guideOpsList = [
    {
      key: 'access',
      name: '设备接入配置',
      english: 'DEVICE ACCESS CONFIGURATION',
      auth: !!accessPermission,
      url: 'link/AccessConfig',
    },
    {
      key: 'logger',
      name: '日志排查',
      english: 'LOG SCREEN',
      auth: !!logPermission,
      url: 'Log',
      param: {
        key: 'system',
      },
    },
    {
      key: 'realtime',
      name: '实时监控',
      english: 'REAL-TIME MONITORING',
      auth: !!linkPermission,
      url: 'link/DashBoard',
      param: {
        save: true,
      },
    },
  ];

  return (
    <Row gutter={24}>
      <Col span={14}>
        <Guide title="物联网引导" data={guideList} />
      </Col>
      <Col span={10}>
        <Statistics
          data={[
            {
              name: '产品数量',
              value: productCount,
              children: '',
            },
            {
              name: '设备数量',
              value: deviceCount,
              children: '',
            },
          ]}
          title="设备统计"
          extra={
            <div style={{ fontSize: 14, fontWeight: 400 }}>
              <a
                onClick={() => {
                  const url = getMenuPathByCode(MENUS_CODE['device/DashBoard']);
                  if (!!url) {
                    history.push(`${url}`);
                  } else {
                    message.warning('暂无权限，请联系管理员');
                  }
                }}
              >
                详情
              </a>
            </div>
          }
        />
      </Col>
      <Col span={14}>
        <Guide title="运维引导" data={guideOpsList} />
      </Col>
      <Col span={10}>
        <Statistics
          data={[
            {
              name: 'CPU使用率',
              value: String(cpuValue) + '%',
              children: <Pie value={cpuValue} />,
            },
            {
              name: 'JVM内存',
              value: String(jvmValue) + '%',
              children: <Pie value={jvmValue} />,
            },
          ]}
          title="基础统计"
          extra={
            <div style={{ fontSize: 14, fontWeight: 400 }}>
              <a
                onClick={() => {
                  const url = getMenuPathByCode(MENUS_CODE['link/DashBoard']);
                  if (!!url) {
                    history.push(`${url}`);
                  } else {
                    message.warning('暂无权限，请联系管理员');
                  }
                }}
              >
                详情
              </a>
            </div>
          }
        />
      </Col>
      <Col span={24}>
        <Body title={'平台架构图'} english={'PLATFORM ARCHITECTURE DIAGRAM'} />
      </Col>
      {/* <Col span={24}>
        <Steps />
      </Col>
      <Col span={24}>
        <Steps />
      </Col> */}
    </Row>
  );
};
export default Comprehensive;
