import { StatisticCard } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import { useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import CPU from '@/pages/Analysis/CPU';
import Jvm from '@/pages/Analysis/Jvm';
import DeviceMessageChart from '@/pages/Analysis/DeviceMessage';
import DeviceChart from '@/pages/Analysis/DeviceChart';
import MessageChart from '@/pages/Analysis/MessageChart';
import Service from '@/pages/Analysis/service';

const { Divider } = StatisticCard;

export const service = new Service();
const Analysis = () => {
  const [responsive, setResponsive] = useState(false);
  const intl = useIntl();

  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <StatisticCard.Group direction={responsive ? 'column' : 'row'}>
        <StatisticCard
          title={intl.formatMessage({
            id: 'pages.analysis.cpu',
            defaultMessage: 'CPU使用率',
          })}
          chart={<CPU />}
        />
        <Divider type={responsive ? 'horizontal' : 'vertical'} />
        <StatisticCard
          title={intl.formatMessage({
            id: 'pages.analysis.jvm',
            defaultMessage: 'JVM内存',
          })}
          chart={<Jvm />}
        />
        <Divider type={responsive ? 'horizontal' : 'vertical'} />
        <StatisticCard title="今日设备消息量" chart={<MessageChart />} />
        <Divider type={responsive ? 'horizontal' : 'vertical'} />
        <DeviceChart />
      </StatisticCard.Group>
      <Divider type={responsive ? 'horizontal' : 'vertical'} />

      <DeviceMessageChart />
    </RcResizeObserver>
  );
};
export default Analysis;
