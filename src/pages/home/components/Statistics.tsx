import Title from '@/pages/home/components/Title';
import React from 'react';
import './index.less';

type StatisticsItem = {
  name: string;
  value: number | string;
  children: React.ReactNode | string;
};

interface StatisticsProps {
  extra?: React.ReactNode | string;
  data: StatisticsItem[];
  title: string;
}

const defaultImage = require('/public/images/home/top-1.png');

const Statistics = (props: StatisticsProps) => {
  return (
    <div className={'home-statistics'}>
      <Title title={props.title} extra={props.extra} />
      <div className={'home-statistics-body'}>
        {props.data.map((item) => (
          <div className={'home-guide-item'} key={item.name}>
            <div className={'item-english'}>{item.name}</div>
            <div className={'item-title'}>{item.value}</div>
            {typeof item.children === 'string' ? (
              <div className={`item-index`}>
                <img src={item.children || defaultImage} />
              </div>
            ) : (
              <div className={'item-index-echarts'}>{item.children}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
