import Title from '@/pages/home/components/Title';
import React from 'react';
import './index.less';

type StatisticsItem = {
  name: string;
  value: number;
  img: string;
};

interface StatisticsProps {
  extra?: React.ReactNode | string;
  data: StatisticsItem[];
}

const defaultImage = require('/public/images/home/top-1.png');

const Statistics = (props: StatisticsProps) => {
  return (
    <div className={'home-statistics'}>
      <Title title={'设备统计'} extra={props.extra} />
      <div className={'home-statistics-body'}>
        {props.data.map((item) => (
          <div className={'home-guide-item'}>
            <div className={'item-english'}>{item.name}</div>
            <div className={'item-title'}>{item.value}</div>
            <div className={`item-index`}>
              <img src={item.img || defaultImage} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics;
