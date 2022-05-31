import { PageContainer } from '@ant-design/pro-layout';
import { Card, Badge } from 'antd';
import { useEffect, useState } from 'react';
import './index.less';
import Service from './service';
import encodeQuery from '@/utils/encodeQuery';
import { useRequest } from 'umi';
import DashBoard from '@/components/DashBoard';
import type { EChartsOption } from 'echarts';
import Echarts from '@/components/DashBoard/echarts';

interface TopCardProps {
  isEcharts: boolean;
  title: string;
  total?: number | string;
  topRender?: any;
  bottomRender: () => React.ReactNode;
}
const service = new Service('device/instance');
const TopCard = (props: TopCardProps) => {
  return (
    <div className={'top-card-item'}>
      {props.isEcharts ? (
        <div className={'top-card-top'}>
          <div className={'top-card-top-charts'}>
            <div>{props.title}</div>
            <div className={'top-card-top-charts-total'}>{props.total}</div>
            <div style={{ height: 40 }}>{props.topRender}</div>
          </div>
        </div>
      ) : (
        <div className={'top-card-top'}>
          <div className={'top-card-top-left'}></div>
          <div className={'top-card-top-right'}>
            <div className={'top-card-title'}>{props.title}</div>
            <div className={'top-card-total'}>{props.total}</div>
          </div>
        </div>
      )}

      <div className={'top-card-bottom'}>{props.bottomRender()}</div>
    </div>
  );
};

const DeviceBoard = () => {
  const [deviceOnline, setDeviceOnline] = useState(0);
  const [deviceOffline, setDeviceOffline] = useState(0);
  const [options, setOptions] = useState<EChartsOption>({
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        areaStyle: {},
      },
    ],
  });

  const { data: deviceTotal } = useRequest(service.deviceCount, {
    formatResult: (res) => res.result,
  });

  //设备数量
  const deviceStatus = async () => {
    const onlineRes = await service.deviceCount(encodeQuery({ terms: { state: 'online' } }));
    if (onlineRes.status === 200) {
      setDeviceOnline(onlineRes.result);
    }
    const offlineRes = await service.deviceCount(encodeQuery({ terms: { state: 'offline' } }));
    if (offlineRes.status === 200) {
      setDeviceOffline(offlineRes.result);
    }
  };

  const getEcharts = async (params: any) => {
    // 请求数据
    console.log(params);

    setOptions({
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          areaStyle: {},
        },
      ],
    });
  };

  useEffect(() => {
    deviceStatus();
  }, []);

  return (
    <PageContainer>
      <div className={'device-dash-board'}>
        <Card className={'top-card-items'} bodyStyle={{ display: 'flex', gap: 12 }}>
          <TopCard
            title={'产品数量'}
            total={1}
            isEcharts={false}
            bottomRender={() => (
              <>
                <Badge status="success" text="未发布" />{' '}
                <span style={{ padding: '0 4px' }}>{1}</span>
                <Badge status="error" text="已发布" /> <span style={{ padding: '0 4px' }}>{1}</span>
              </>
            )}
          />
          <TopCard
            title={'设备数量'}
            total={deviceTotal}
            isEcharts={false}
            bottomRender={() => (
              <>
                <Badge status="success" text="在线" />{' '}
                <span style={{ padding: '0 4px' }}>{deviceOnline}</span>
                <Badge status="error" text="离线" />{' '}
                <span style={{ padding: '0 4px' }}>{deviceOffline}</span>
              </>
            )}
          />
          <TopCard
            title={'当前在线'}
            total={22}
            isEcharts={true}
            topRender={
              <div style={{ height: 50 }}>
                <Echarts options={options} />
              </div>
            }
            bottomRender={() => <>昨日在线： </>}
          />
          <TopCard
            title={'今日设备消息量'}
            total={2221}
            isEcharts={true}
            bottomRender={() => <>当月设备消息量： </>}
          />
        </Card>
        <DashBoard
          title={'设备消息'}
          options={options}
          height={500}
          initialValues={{
            test: '2',
          }}
          onParamsChange={getEcharts}
        />
        {/* <Echarts options={options} /> */}
      </div>
    </PageContainer>
  );
};
export default DeviceBoard;
