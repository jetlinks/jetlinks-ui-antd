import Title from '@/pages/home/components/Title';
import React from 'react';
import './index.less';

type StatisticsItem = {
  name: string;
  value: number | string;
  children: React.ReactNode | string;
  permission?: any;
  node?: any;
};

interface StatisticsProps {
  extra?: React.ReactNode | string;
  style?: any;
  height?: any;
  data: StatisticsItem[];
  title: string;
}

const defaultImage = require('/public/images/home/top-1.png');

const CardStatistics = (props: StatisticsProps) => {
  return (
    <div className={'home-statistics'} style={{ height: props.height }}>
      <Title title={props.title} extra={props.extra} />
      <div className={'home-statistics-body'} style={props.style}>
        {props.data.map((item) => (
          <div className={'home-guide-item'} key={item.name}>
            <div className={'item-english'}>{item.name}</div>
            {item.node ? (
              <div style={{ display: 'flex', marginTop: 15, width: '60%' }}>
                {item.node.map((i: any) => (
                  <div style={{ marginRight: 7 }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{i.value}</div>
                    <div className={`state ${i.className}`}>{i.name}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={'item-title'}>{item.permission ? item.permission : item.value}</div>
            )}

            {typeof item.children === 'string' ? (
              <div className={`item-index`}>
                <img src={item.children || defaultImage} />
              </div>
            ) : (
              <div className={'item-index-echarts'} style={{ height: 75, width: 110 }}>
                {item.children}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardStatistics;
