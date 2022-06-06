import { Col, message, Row } from 'antd';
import Guide from '../components/Guide';
import { PermissionButton } from '@/components';
import Statistics from '../components/Statistics';
import Pie from '@/pages/home/components/Pie';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { useEffect, useState } from 'react';
import { map } from 'rxjs';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import useHistory from '@/hooks/route/useHistory';
import Body from '@/pages/home/components/Body';
import Steps from '@/pages/home/components/Steps';

const Ops = () => {
  const [subscribeTopic] = useSendWebsocketMessage();
  const history = useHistory();

  const productPermission = PermissionButton.usePermission('device/Product').permission;
  const devicePermission = PermissionButton.usePermission('device/Instance').permission;
  const rulePermission = PermissionButton.usePermission('rule-engine/Instance').permission;

  const [cpuValue, setCpuValue] = useState<number>(0);
  const [jvmValue, setJvmValue] = useState<number>(0);

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
  const guideOpsList = [
    {
      key: 'product',
      name: '设备接入配置',
      english: 'CREATE PRODUCT',
      auth: !!productPermission.add,
      url: 'device/Product',
      param: '?save=true',
    },
    {
      key: 'device',
      name: '日志排查',
      english: 'CREATE DEVICE',
      auth: !!devicePermission.add,
      url: 'device/Instance',
      param: '?save=true',
    },
    {
      key: 'rule-engine',
      name: '实时监控',
      english: 'RULE ENGINE',
      auth: !!rulePermission.add,
      url: 'rule-engine/Instance',
      param: '?save=true',
    },
  ];
  return (
    <Row gutter={24}>
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
      <Col span={24}>
        <Body title={'平台架构图'} english={'PLATFORM ARCHITECTURE DIAGRAM'} />
      </Col>
      <Col span={24}>
        <Steps />
      </Col>
    </Row>
  );
};
export default Ops;
