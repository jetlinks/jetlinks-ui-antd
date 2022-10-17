import { PageContainer } from '@ant-design/pro-layout';
import DashBoard, { DashBoardTopCard } from '@/components/DashBoard';
import { useRequest } from 'umi';
import { useEffect, useState } from 'react';
import Service from './service';
import './index.less';
import encodeQuery from '@/utils/encodeQuery';
import type { EChartsOption } from 'echarts';
import moment from 'moment';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const service = new Service('media');

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

  // const getInterval = (type: string) => {
  //   switch (type) {
  //     case 'year':
  //       return '30d';
  //     case 'month':
  //     case 'week':
  //       return '1d';
  //     case 'hour':
  //       return '1m';
  //     default:
  //       return '1h';
  //   }
  // };

  const getEcharts = async (params: any) => {
    let _time = '1h';
    let format = 'HH';
    let limit = 12;
    const dt = params.time.end - params.time.start;
    const hour = 60 * 60 * 1000;
    const day = hour * 24;
    const month = day * 30;
    const year = 365 * day;
    if (dt <= day) {
      limit = Math.abs(Math.ceil(dt / hour));
    } else if (dt > day && dt < year) {
      limit = Math.abs(Math.ceil(dt / day)) + 1;
      _time = '1d';
      format = 'M月dd日';
    } else if (dt >= year) {
      limit = Math.abs(Math.floor(dt / month));
      _time = '1M';
      format = 'yyyy年-M月';
    }
    const resp = await service.getMulti([
      {
        dashboard: 'media_stream',
        object: 'play_count',
        measurement: 'quantity',
        dimension: 'agg',
        group: 'playCount',
        params: {
          time: _time, // getInterval(params.time.type),
          from: moment(params.time.start).format('YYYY-MM-DD HH:mm:ss'),
          to: moment(params.time.end).format('YYYY-MM-DD HH:mm:ss'),
          limit: limit,
          format: format,
        },
      },
    ]);

    if (resp.status === 200) {
      const xData: string[] = [];
      const sData: number[] = [];
      resp.result
        .sort((a: any, b: any) => b.data.timestamp - a.data.timestamp)
        .forEach((item: any) => {
          xData.push(item.data.timeString);
          sData.push(item.data.value);
        });

      setOptions({
        xAxis: {
          type: 'category',
          data: xData,
        },
        tooltip: {
          trigger: 'axis',
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
        },
        grid: {
          left: '4%',
          right: '2%',
          top: '2%',
        },
        color: ['#2F54EB'],
        series: [
          {
            data: sData,
            type: 'bar',
            barWidth: 16,
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
      if (time >= 60 * 60 * 1000) {
        hour = Math.trunc(time / (60 * 60 * 1000));
      }

      if (time >= 60 * 1000) {
        min = Math.trunc((time - hour * 60 * 60 * 1000) / (60 * 1000));
      }

      sec = Math.trunc((time - hour * (60 * 60 * 1000) - min * 60 * 1000) / 1000);
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
        <DashBoardTopCard>
          <DashBoardTopCard.Item
            title={'设备数量'}
            value={deviceTotal}
            footer={[
              {
                title: '在线',
                value: deviceOnline,
                status: 'success',
              },
              {
                title: '离线',
                value: deviceOffline,
                status: 'error',
              },
            ]}
            span={6}
          >
            <img src={require('/public/images/media/dashboard-1.png')} />
          </DashBoardTopCard.Item>
          <DashBoardTopCard.Item
            title={'通道数量'}
            value={channelTotal}
            footer={[
              {
                title: '已连接',
                value: channelOnline,
                status: 'success',
              },
              {
                title: '未连接',
                value: channelOffline,
                status: 'error',
              },
            ]}
            span={6}
          >
            <img src={require('/public/images/media/dashboard-2.png')} />
          </DashBoardTopCard.Item>
          <DashBoardTopCard.Item
            title={'录像数量'}
            value={fileObject ? fileObject.total : 0}
            footer={[
              {
                title: '总时长',
                value: handleTimeFormat(fileObject ? fileObject.duration : 0),
              },
            ]}
            span={6}
          >
            <img src={require('/public/images/media/dashboard-3.png')} />
          </DashBoardTopCard.Item>
          <DashBoardTopCard.Item
            title={
              <span>
                播放中数量
                <Tooltip title={'当前正在播放的通道数量之和'}>
                  <QuestionCircleOutlined style={{ marginLeft: 12 }} />
                </Tooltip>
              </span>
            }
            value={playObject ? playObject.playerTotal : 0}
            footer={[
              {
                title: '播放人数',
                value: playObject ? playObject.playingTotal : 0,
              },
            ]}
            span={6}
          >
            <img src={require('/public/images/media/dashboard-4.png')} />
          </DashBoardTopCard.Item>
        </DashBoardTopCard>
        <DashBoard
          showTimeTool={true}
          showTime
          className={'media-dash-board-body'}
          title={'播放数量(人次)'}
          options={options}
          height={500}
          defaultTime={'week'}
          onParamsChange={getEcharts}
        />
      </div>
    </PageContainer>
  );
};
