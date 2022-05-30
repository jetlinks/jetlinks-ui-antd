import { PageContainer } from '@ant-design/pro-layout';
import { Badge, Card, Select } from 'antd';
import DashBoard from '@/components/DashBoard';
import { useRequest } from 'umi';
import React, { useEffect, useState } from 'react';
import Service from './service';
import './index.less';
import encodeQuery from '@/utils/encodeQuery';
import { EChartsOption } from 'echarts';

interface TopCardProps {
  url: string;
  title: string;
  total: number | string;
  bottomRender: () => React.ReactNode;
}

const service = new Service('media/device');

const TopCard = (props: TopCardProps) => {
  return (
    <div className={'top-card-item'}>
      <div className={'top-card-top'}>
        <div className={'top-card-top-left'}></div>
        <div className={'top-card-top-right'}>
          <div className={'top-card-title'}>{props.title}</div>
          <div className={'top-card-total'}>{props.total}</div>
        </div>
      </div>
      <div className={'top-card-bottom'}>{props.bottomRender()}</div>
    </div>
  );
};

export default () => {
  const [deviceOnline, setDeviceOnline] = useState(0);
  const [deviceOffline, setDeviceOffline] = useState(0);
  const [options, setOptions] = useState<EChartsOption>({});

  const { data: deviceTotal } = useRequest(service.deviceCount, {
    formatResult: (res) => res.result,
  });

  /**
   * 设备数量
   */
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
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
        },
      ],
    });
  };

  useEffect(() => {
    deviceStatus();
  }, []);

  return (
    <PageContainer>
      <div className={'media-dash-board'}>
        <Card className={'top-card-items'} bodyStyle={{ display: 'flex', gap: 12 }}>
          <TopCard
            title={'设备数量'}
            total={deviceTotal}
            url={''}
            bottomRender={() => (
              <>
                <Badge status="error" text="在线" />{' '}
                <span style={{ padding: '0 4px' }}>{deviceOnline}</span>
                <Badge status="success" text="离线" />{' '}
                <span style={{ padding: '0 4px' }}>{deviceOffline}</span>
              </>
            )}
          />
          <TopCard
            title={'通道数量'}
            total={12}
            url={''}
            bottomRender={() => (
              <>
                <Badge status="error" text="在线" /> <span style={{ padding: '0 4px' }}>12</span>
                <Badge status="success" text="离线" /> <span style={{ padding: '0 4px' }}>12</span>
              </>
            )}
          />
          <TopCard
            title={'录像数量'}
            total={12}
            url={''}
            bottomRender={() => <div>总时长: </div>}
          />
          <TopCard
            title={'播放中数量'}
            total={12}
            url={''}
            bottomRender={() => <div>播放人数: </div>}
          />
        </Card>
        <DashBoard
          title={'播放数量(人次)'}
          options={options}
          height={500}
          initialValues={{
            test: '2',
          }}
          extraParams={{
            key: 'test',
            Children: (
              <Select
                options={[
                  { label: '1', value: '1' },
                  { label: '2', value: '2' },
                ]}
              ></Select>
            ),
          }}
          onParamsChange={getEcharts}
        />
      </div>
    </PageContainer>
  );
};
