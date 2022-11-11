import { PageContainer } from '@ant-design/pro-layout';
import { useEffect, useRef, useState } from 'react';
import './index.less';
import service from '../service';
import DashBoard, { DashBoardTopCard } from '@/components/DashBoard';
import type { EChartsOption } from 'echarts';

type RefType = {
  getValues: Function;
};

const DeviceBoard = () => {
  const [channel, setChannel] = useState(0);
  const [errorChannel, setErrorChannel] = useState(0);
  const [collector, setCollector] = useState(0);
  const [errorCollector, setErrorCollector] = useState(0);
  const [point, setPoint] = useState(0);
  const [errorPoint, setErrorPoint] = useState(0);
  const ref = useRef<RefType>();
  const [options, setOptions] = useState<EChartsOption>({});
  const [timeToolOptions] = useState([
    { label: '最近1小时', value: 'hour' },
    { label: '今日', value: 'today' },
    { label: '近一周', value: 'week' },
  ]);

  //通道数量
  const channelStatus = async () => {
    const channelRes = await service.queryChannelCount({});
    if (channelRes.status === 200) {
      setChannel(channelRes.result);
    }
    const errorChannelRes = await service.queryChannelCount({
      terms: [
        {
          column: 'runningState',
          termType: 'not',
          value: 'running',
        },
      ],
    });
    if (errorChannelRes.status === 200) {
      setErrorChannel(errorChannelRes.result);
    }
  };

  //采集器数量
  const collectorStatus = async () => {
    const collectorRes = await service.queryCollectorCount({});
    if (collectorRes.status === 200) {
      setCollector(collectorRes.result);
    }
    const errorCollectorRes = await service.queryCollectorCount({
      terms: [
        {
          column: 'runningState',
          termType: 'not',
          value: 'running',
        },
      ],
    });
    if (errorCollectorRes.status === 200) {
      setErrorCollector(errorCollectorRes.result);
    }
  };

  // 点位
  const pointStatus = async () => {
    const pointRes = await service.queryPointCount({});
    if (pointRes.status === 200) {
      setPoint(pointRes.result);
    }
    const errorPointRes = await service.queryPointCount({
      terms: [
        {
          column: 'runningState',
          termType: 'not',
          value: 'running',
        },
      ],
    });
    if (errorPointRes.status === 200) {
      setErrorPoint(errorPointRes.result);
    }
  };

  const getParams = (dt: any) => {
    switch (dt.type) {
      case 'today':
        return {
          limit: 24,
          interval: '1h',
          format: 'HH:mm',
        };
      case 'week':
        return {
          limit: 7,
          interval: '1d',
          format: 'MM-dd',
        };
      case 'hour':
        return {
          limit: 60,
          interval: '1m',
          format: 'HH:mm',
        };
      default:
        const time = dt.end - dt.start;
        const hour = 60 * 60 * 1000;
        const days = hour * 24;
        if (time <= hour) {
          return {
            limit: Math.abs(Math.ceil(time / (60 * 60))),
            interval: '1m',
            format: 'HH:mm',
          };
        } else if (time > hour && time <= days) {
          return {
            limit: Math.abs(Math.ceil(time / hour)),
            interval: '1h',
            format: 'HH:mm',
          };
        } else {
          return {
            limit: Math.abs(Math.ceil(time / days)) + 1,
            interval: '1d',
            format: 'MM-dd',
          };
        }
    }
  };

  const getEcharts = async () => {
    const data = ref.current!.getValues();
    const res = await service.dashboard([
      {
        dashboard: 'collector',
        object: 'pointData',
        measurement: 'quantity',
        dimension: 'agg',
        params: {
          limit: getParams(data.time).limit,
          from: data.time.start,
          to: data.time.end,
          interval: getParams(data.time).interval,
          format: getParams(data.time).format,
        },
      },
    ]);
    if (res.status === 200) {
      const x = res.result.map((item: any) => item.data.timeString).reverse();
      const y = res.result.map((item: any) => item.data.value).reverse();
      setOptions({
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: x,
        },
        yAxis: {
          type: 'value',
        },
        tooltip: {
          trigger: 'axis',
        },
        grid: {
          top: '2%',
          bottom: '5%',
          // left: '50px',
          // right: '50px',
        },
        series: [
          {
            name: '消息量',
            data: y,
            type: 'line',
            smooth: true,
            color: '#60DFC7',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: '#60DFC7', // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#FFFFFF', //   0% 处的颜色
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
        ],
      });
    }
  };

  useEffect(() => {
    channelStatus();
    collectorStatus();
    pointStatus();
  }, []);

  return (
    <PageContainer>
      <div className={'device-dash-board'}>
        <DashBoardTopCard>
          <DashBoardTopCard.Item
            title={'通道数量'}
            value={channel}
            footer={[
              {
                title: '异常通道',
                value: errorChannel,
                status: 'error',
              },
            ]}
            span={8}
          >
            <img src={require('/public/images/DataCollect/dashboard/channel.png')} />
          </DashBoardTopCard.Item>
          <DashBoardTopCard.Item
            title={'采集器数量'}
            value={collector}
            footer={[
              {
                title: '异常采集器',
                value: errorCollector,
                status: 'error',
              },
            ]}
            span={8}
          >
            <img src={require('/public/images/DataCollect/dashboard/collector.png')} />
          </DashBoardTopCard.Item>
          <DashBoardTopCard.Item
            title={'采集点位'}
            value={point}
            footer={[
              {
                title: '异常点位',
                value: errorPoint,
                status: 'error',
              },
            ]}
            span={8}
          >
            <img src={require('/public/images/DataCollect/dashboard/point.png')} />
          </DashBoardTopCard.Item>
        </DashBoardTopCard>
        <DashBoard
          title={'点位数据量'}
          options={options}
          ref={ref}
          height={500}
          defaultTime={'hour'}
          timeToolOptions={timeToolOptions}
          showTime={true}
          showTimeTool={true}
          onParamsChange={getEcharts}
        />
      </div>
    </PageContainer>
  );
};
export default DeviceBoard;
