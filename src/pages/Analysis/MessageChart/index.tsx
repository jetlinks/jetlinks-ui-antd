import { Column } from '@ant-design/charts';
import moment from 'moment';
import { useEffect } from 'react';
import { service } from '@/pages/Analysis';
import { ColumnConfig } from '@ant-design/plots/es/components/column';

const calculationDate = () => {
  const dd = new Date();
  dd.setDate(dd.getDate() - 30);
  const y = dd.getFullYear();
  const m = dd.getMonth() + 1 < 10 ? `0${dd.getMonth() + 1}` : dd.getMonth() + 1;
  const d = dd.getDate() < 10 ? `0${dd.getDate()}` : dd.getDate();
  return `${y}-${m}-${d} 00:00:00`;
};

const MessageChart = () => {
  const list = [
    {
      dashboard: 'device',
      object: 'message',
      measurement: 'quantity',
      dimension: 'agg',
      group: 'sameDay',
      params: {
        time: '1d',
        format: 'yyyy-MM-dd',
      },
    },
    {
      dashboard: 'device',
      object: 'message',
      measurement: 'quantity',
      dimension: 'agg',
      group: 'sameMonth',
      params: {
        limit: 30,
        time: '1d',
        format: 'yyyy-MM-dd',
        from: calculationDate(),
        to: `${moment(new Date()).format('YYYY-MM-DD')} 23:59:59`,
      },
    },
    {
      dashboard: 'device',
      object: 'message',
      measurement: 'quantity',
      dimension: 'agg',
      group: 'month',
      params: {
        time: '1M',
        format: 'yyyy-MM-dd',
        from: calculationDate(),
        to: `${moment(new Date()).format('YYYY-MM-DD')} 23:59:59`,
      },
    },
  ];

  useEffect(() => {
    service.getMulti(list).subscribe((data) => {
      console.log(data);
    });
  }, []);

  const data = [
    {
      type: '1-3秒',
      value: 0.16,
    },
    {
      type: '4-10秒',
      value: 0.125,
    },
    {
      type: '11-30秒',
      value: 0.24,
    },
    {
      type: '31-60秒',
      value: 0.19,
    },
    {
      type: '1-3分',
      value: 0.22,
    },
    {
      type: '3-10分',
      value: 0.05,
    },
    {
      type: '10-30分',
      value: 0.01,
    },
    {
      type: '30+分',
      value: 0.015,
    },
  ];

  const paletteSemanticRed = '#F4664A';
  const brandColor = '#5B8FF9';
  const config: ColumnConfig = {
    data,
    xField: 'type',
    yField: 'value',
    seriesField: '',
    color: function color(_ref: any) {
      const { type } = _ref;
      if (type === '10-30分' || type === '30+分') {
        return paletteSemanticRed;
      }
      return brandColor;
    },
    width: 200,
    height: 200,
    label: {
      offset: 10,
    },
    legend: false,
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };
  return <Column {...config} />;
};
export default MessageChart;
