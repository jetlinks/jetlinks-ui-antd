import { PageContainer } from '@ant-design/pro-layout';
import { StatisticCard } from '@ant-design/pro-card';
import RcResizeObserver from 'rc-resize-observer';
import { useState } from 'react';
import { useIntl } from '@@/plugin-locale/localeExports';
import CPU from '@/pages/Analysis/CPU';
import Jvm from '@/pages/Analysis/Jvm';

const { Divider } = StatisticCard;

const Analysis = () => {
  const [responsive, setResponsive] = useState(false);
  const intl = useIntl();

  return (
    <PageContainer>
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 596);
        }}
      >
        <StatisticCard.Group direction={responsive ? 'column' : 'row'}>
          <StatisticCard
            statistic={{
              title: intl.formatMessage({
                id: 'pages.analysis.cpu',
                defaultMessage: 'CPU使用率',
              }),
            }}
            chart={<CPU />}
          />
          <Divider type={responsive ? 'horizontal' : 'vertical'} />
          <StatisticCard
            statistic={{
              title: intl.formatMessage({
                id: 'pages.analysis.jvm',
                defaultMessage: 'JVM内存',
              }),
            }}
            chart={<Jvm />}
          />
          <Divider type={responsive ? 'horizontal' : 'vertical'} />
          <StatisticCard
            statistic={{
              title: intl.formatMessage({
                id: 'pages.analysis.information',
                defaultMessage: '信息完成度',
              }),
              value: 5,
              suffix: '/ 100',
            }}
            chart={
              <img
                src="https://gw.alipayobjects.com/zos/alicdn/RLeBTRNWv/bianzu%25252043x.png"
                alt="直方图"
                width="100%"
              />
            }
          />
        </StatisticCard.Group>
      </RcResizeObserver>
    </PageContainer>
  );
};
export default Analysis;
