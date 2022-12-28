import Statistics from '../components/Statistics';
import './index.less';
import Pie from '@/pages/home/components/Pie';
import { getMenuPathByCode, MENUS_CODE } from '@/utils/menu';
import { message } from 'antd';
import { useEffect, useState } from 'react';
import useSendWebsocketMessage from '@/hooks/websocket/useSendWebsocketMessage';
import { map } from 'rxjs';
import useHistory from '@/hooks/route/useHistory';

const BaseStatistics = () => {
  const [subscribeTopic] = useSendWebsocketMessage();
  const history = useHistory();
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
  return (
    <Statistics
      data={[
        {
          name: 'CPU使用率',
          value: String(cpuValue) + '%',
          children: (
            <Pie
              value={cpuValue}
              color={['#EBEBEB', '#D3ADF7']}
              image={require('/public/images/home/top-3.svg')}
            />
          ),
        },
        {
          name: 'JVM内存',
          value: String(jvmValue) + '%',
          children: (
            <Pie
              value={jvmValue}
              color={['#D6E4FF', '#85A5FF']}
              image={require('/public/images/home/top-4.svg')}
            />
          ),
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
  );
};

export default BaseStatistics;
