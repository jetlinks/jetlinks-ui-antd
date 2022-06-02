import { PageContainer } from '@ant-design/pro-layout';
import { Badge, Card } from 'antd';
import DashBoard from '@/components/DashBoard';
import { useRequest } from 'umi';
import React, { useEffect, useState } from 'react';
import Service from './service';
import './index.less';
import encodeQuery from '@/utils/encodeQuery';
import type { EChartsOption } from 'echarts';
import moment from 'moment';

interface TopCardProps {
  url: string;
  title: string;
  total: number | string;
  bottomRender: () => React.ReactNode;
}

const service = new Service('media');

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
  const [channelOnline, setChannelOnline] = useState(0);
  const [channelOffline, setChannelOffline] = useState(0);
  const [options, setOptions] = useState<EChartsOption>({});

  const { data: deviceTotal } = useRequest(service.deviceCount, {
    formatResult: (res) => res.result,
  });

  const { data: playObject } = useRequest(service.playingAgg, {
    formatResult: (res) => res.result,
  });

  const { data: fileObject } = useRequest(service.fileAgg, {
    formatResult: (res) => res.result,
  });

  const { data: channelTotal } = useRequest<any, any>(service.channelCount, {
    formatResult: (res) => res.result,
    defaultParams: {},
  });

  /**
   * 通道数量
   */
  const channelStatus = async () => {
    const onlineRes = await service.channelCount({
      terms: [{ column: 'status', value: 'online' }],
    });
    if (onlineRes.status === 200) {
      setChannelOnline(onlineRes.result);
    }
    const offlineRes = await service.channelCount({
      terms: [{ column: 'status$not', value: 'online' }],
    });
    if (offlineRes.status === 200) {
      setChannelOffline(offlineRes.result);
    }
  };

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
    const resp = await service.getMulti([
      {
        dashboard: 'media_stream',
        object: 'play_count',
        measurement: 'quantity',
        dimension: 'agg',
        group: 'playCount',
        params: {
          time: params.time.type === 'today' ? '1h' : '1d',
          from: moment(params.time.start).format('YYYY-MM-DD HH:mm:ss'),
          to: moment(params.time.end).format('YYYY-MM-DD HH:mm:ss'),
          limit: 30,
        },
      },
    ]);

    if (resp.status === 200) {
      const xData: string[] = [];
      const sData: number[] = [];
      resp.result.forEach((item: any) => {
        xData.push(item.data.timeString);
        sData.push(item.data.value);
      });

      setOptions({
        xAxis: {
          type: 'category',
          data: xData,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: sData,
            type: 'bar',
          },
        ],
      });
    }
  };

  const handleTimeFormat = (time: number) => {
    let hour = 0;
    let min = 0;
    let sec = 0;
    const timeStr = 'hh小时mm分钟ss秒';

    if (time) {
      if (time >= 6000) {
        hour = Math.trunc(time / (60 * 60));
      }

      if (time >= 60) {
        min = Math.trunc((time - hour * 60 * 60) / 60);
      }

      sec = time - hour * (60 * 60) - min * 60;
    }

    return timeStr
      .replace('hh', hour.toString())
      .replace('mm', min.toString())
      .replace('ss', sec.toString());
  };

  useEffect(() => {
    deviceStatus();
    channelStatus();
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
                <Badge status="success" text="在线" />{' '}
                <span style={{ padding: '0 4px' }}>{deviceOnline}</span>
                <Badge status="error" text="离线" />{' '}
                <span style={{ padding: '0 4px' }}>{deviceOffline}</span>
              </>
            )}
          />
          <TopCard
            title={'通道数量'}
            total={channelTotal}
            url={''}
            bottomRender={() => (
              <>
                <Badge status="success" text="已连接" />{' '}
                <span style={{ padding: '0 4px' }}>{channelOnline}</span>
                <Badge status="error" text="未连接" />{' '}
                <span style={{ padding: '0 4px' }}>{channelOffline}</span>
              </>
            )}
          />
          <TopCard
            title={'录像数量'}
            total={fileObject ? fileObject.total : 0}
            url={''}
            bottomRender={() => (
              <div>
                总时长:
                {handleTimeFormat(fileObject ? fileObject.duration : 0)}
              </div>
            )}
          />
          <TopCard
            title={'播放中数量'}
            total={playObject ? playObject.playerTotal : 0}
            url={''}
            bottomRender={() => <div>播放人数: {playObject ? playObject.playingTotal : 0}</div>}
          />
        </Card>
        <DashBoard
          className={'media-dash-board-body'}
          title={'播放数量(人次)'}
          options={options}
          height={500}
          onParamsChange={getEcharts}
        />
      </div>
    </PageContainer>
  );
};
