import { Area } from '@ant-design/charts';
import { service } from '@/pages/Analysis';
import { useEffect } from 'react';
import { groupBy, map, mergeMap } from 'rxjs/operators';
import { of, toArray, zip } from 'rxjs';
import { model } from '@formily/reactive';
import { observer } from '@formily/react';
import { StatisticCard } from '@ant-design/pro-card';
import { Radio } from 'antd';
import type { DurationInputArg1, DurationInputArg2 } from 'moment';
import moment from 'moment';

type DeviceMessage = {
  chartData: any[];
  startDate: string;
  endDate: string;
  timeType: string;
  dateType: '1d' | '1h' | '7d' | '30d';
};
const DateFormat = 'YYYY-MM-DD HH:mm:ss';

const DeviceMessageModel = model<DeviceMessage>({
  chartData: [],
  startDate: moment(new Date()).format(DateFormat),
  endDate: moment(new Date()).format(DateFormat),
  timeType: '1m',
  dateType: '1h',
});

const DeviceMessageChart = observer(() => {
  const gatewayMonitor = (from: string, to: string, time: string) => {
    const params = [
      {
        dashboard: 'gatewayMonitor',
        object: 'deviceGateway',
        measurement: 'received_message',
        dimension: 'agg',
        group: 'sameDay',
        params: {
          time,
          limit: 60,
          format: 'HH时mm分',
          from,
          to,
        },
      },
    ];

    service
      .getMulti(params)
      .pipe(
        mergeMap(
          (item) =>
            item.result as {
              group: string;
              data: {
                value: number;
                timeString: string;
                timestamp: number;
              };
            }[],
        ),
        groupBy((item) => item.group),
        mergeMap((group$) =>
          zip(
            of(group$.key),
            group$.pipe(
              map((item) => ({
                type: '消息量',
                year: item.data.timeString,
                value: item.data.value,
              })),
              toArray(),
            ),
          ),
        ),
      )
      .subscribe((data) => {
        // eslint-disable-next-line prefer-destructuring
        DeviceMessageModel.chartData = data[1];
      });
  };

  const SubtractDate = (startDate: string, amount: DurationInputArg1, unit: DurationInputArg2) =>
    moment(startDate).subtract(amount, unit).format(DateFormat);

  const onDateTypeChange = (type: '1d' | '1h' | '7d' | '30d') => {
    DeviceMessageModel.dateType = type;
    const to = moment(new Date()).format(DateFormat);
    switch (type) {
      case '1h':
        DeviceMessageModel.startDate = SubtractDate(to, 1, 'hours');
        DeviceMessageModel.timeType = '1m';
        break;
      case '1d':
        DeviceMessageModel.startDate = SubtractDate(to, 1, 'days');
        DeviceMessageModel.timeType = '24m';
        break;
      case '7d':
        DeviceMessageModel.startDate = SubtractDate(to, 7, 'days');
        DeviceMessageModel.timeType = '168m';
        break;
      case '30d':
        DeviceMessageModel.startDate = SubtractDate(to, 30, 'days');
        DeviceMessageModel.timeType = '12h';
        break;
      default:
        break;
    }
    gatewayMonitor(
      DeviceMessageModel.startDate,
      DeviceMessageModel.endDate,
      DeviceMessageModel.timeType,
    );
  };
  useEffect(() => {
    onDateTypeChange('1h');
  }, []);

  const config = {
    data: DeviceMessageModel.chartData,
    xField: 'year',
    yField: 'value',
    xAxis: {
      range: [0, 1],
      tickCount: 5,
    },
    slider: {
      start: 0.1,
      end: 0.9,
      trendCfg: { isArea: true },
    },
    areaStyle: function areaStyle() {
      return { fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff' };
    },
  };
  const options = [
    { label: '1小时', value: '1h' },
    { label: '1天', value: '1d' },
    { label: '7天', value: '7d' },
    { label: '30天', value: '30d' },
  ];
  return (
    <StatisticCard
      title="设备消息"
      extra={
        <Radio.Group
          options={options}
          optionType="button"
          size="small"
          value={DeviceMessageModel.dateType}
          onChange={(e) => onDateTypeChange(e.target.value)}
        />
      }
      chart={<Area {...config} />}
    />
  );
});
export default DeviceMessageChart;
