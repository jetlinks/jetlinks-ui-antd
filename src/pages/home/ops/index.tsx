import { Col, message, Row, Tooltip } from 'antd';
import Guide from '../components/Guide';
import Statistics from '../components/Statistics';
import Pie from '@/pages/home/components/Pie';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { useEffect, useState } from 'react';
import { map } from 'rxjs';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import useHistory from '@/hooks/route/useHistory';
import Body from '@/pages/home/components/Body';
import Steps from '@/pages/home/components/Steps';
import { QuestionCircleOutlined } from '@ant-design/icons';

const Ops = () => {
  const [subscribeTopic] = useSendWebsocketMessage();
  const history = useHistory();

  const accessPermission = getMenuPathByCode(MENUS_CODE['link/AccessConfig']);
  const logPermission = getMenuPathByCode(MENUS_CODE['Log']);
  const linkPermission = getMenuPathByCode(MENUS_CODE['link/DashBoard']);
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

  const guideOpsList: any[] = [
    {
      key: 'product',
      name: '设备接入配置',
      english: 'STEP1',
      auth: !!accessPermission,
      url: accessPermission,
    },
    {
      key: 'device',
      name: '日志排查',
      english: 'STEP2',
      auth: !!logPermission,
      url: logPermission,
      param: {
        key: 'system',
      },
    },
    {
      key: 'rule-engine',
      name: '实时监控',
      english: 'STEP3',
      auth: !!linkPermission,
      url: linkPermission,
      param: {
        save: true,
      },
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
        <Steps
          title={
            <span>
              运维管理推荐步骤
              <Tooltip title="请根据业务需要对下述步骤进行选择性操作。">
                <QuestionCircleOutlined style={{ paddingLeft: 12 }} />
              </Tooltip>
            </span>
          }
          data={[
            {
              title: '协议管理',
              content: '根据业务需求自定义开发对应的产品（设备模型）接入协议，并上传到平台。',
              url: require('/public/images/home/bottom-1.png'),
              onClick: () => {
                const url = getMenuPathByCode(MENUS_CODE['link/Protocol']);
                if (!!url) {
                  history.push(url);
                } else {
                  message.warning('暂无权限，请联系管理员');
                }
              },
            },
            {
              title: '证书管理',
              content: '统一维护平台内的证书，用于数据通信加密。',
              url: require('/public/images/home/bottom-6.png'),
              onClick: () => {
                const url = getMenuPathByCode(MENUS_CODE['link/Certificate']);
                if (!!url) {
                  history.push(url);
                } else {
                  message.warning('暂无权限，请联系管理员');
                }
              },
            },
            {
              title: '网络组件',
              content: '根据不同的传输类型配置平台底层网络组件相关参数。',
              url: require('/public/images/home/bottom-3.png'),
              onClick: () => {
                const url = getMenuPathByCode(MENUS_CODE['link/Type']);
                if (!!url) {
                  history.push(url);
                } else {
                  message.warning('暂无权限，请联系管理员');
                }
              },
            },
            {
              title: '设备接入网关',
              content: '根据不同的传输类型，关联消息协议，配置设备接入网关相关参数。',
              url: require('/public/images/home/bottom-4.png'),
              onClick: () => {
                const url = getMenuPathByCode(MENUS_CODE['link/AccessConfig']);
                if (!!url) {
                  history.push(url);
                } else {
                  message.warning('暂无权限，请联系管理员');
                }
              },
            },
            {
              title: '日志管理',
              content: '监控系统日志，及时处理系统异常。',
              url: require('/public/images/home/bottom-5.png'),
              onClick: () => {
                const url = getMenuPathByCode(MENUS_CODE['Log']);
                if (!!url) {
                  history.push(url, {
                    key: 'system',
                  });
                } else {
                  message.warning('暂无权限，请联系管理员');
                }
              },
            },
          ]}
        />
      </Col>
    </Row>
  );
};
export default Ops;
