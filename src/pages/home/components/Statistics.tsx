import Title from '@/pages/home/components/Title';
import React from 'react';
import './index.less';

type StatisticsItem = {
  name: string;
  value: number | string;
  children: React.ReactNode | string;
  permission?: any;
};

interface StatisticsProps {
  extra?: React.ReactNode | string;
  style?: any;
  height?: any;
  data: StatisticsItem[];
  title: string;
}

const defaultImage = require('/public/images/home/top-1.svg');

const Statistics = (props: StatisticsProps) => {
  return (
    <div className={'home-statistics'} style={{ height: props.height }}>
      <Title title={props.title} extra={props.extra} />
      <div className={'home-statistics-body'} style={props.style}>
        {props.data.map((item) => (
          <div className={'home-guide-item'} key={item.name}>
            <div className={'item-english'}>{item.name}</div>
            <div className={'item-title'}>{item.permission ? item.permission : item.value}</div>
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
