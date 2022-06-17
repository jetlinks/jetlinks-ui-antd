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
        grid: {
          left: '4%',
          right: '2%',
          top: '2%',
          bottom: '4%',
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
