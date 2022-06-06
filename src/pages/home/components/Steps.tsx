import './index.less';
import Title from '@/pages/home/components/Title';
import React from 'react';

interface StepItemProps {
  title: string | React.ReactNode;
  content: string | React.ReactNode;
  onClick: () => void;
  url?: string;
}

interface StepsProps {
  title: string | React.ReactNode;
  data: StepItemProps[];
}

const ItemDefaultImg = require('/public/images/home/bottom-1.png');
const StepsItem = (props: StepItemProps) => {
  return (
    <div className={'step-item step-bar arrow-1'} onClick={props.onClick}>
      <div className={'step-item-title'}>
        <div className={'step-item-img'}>
          <img src={props.url || ItemDefaultImg} />
        </div>
        <span>{props.title}</span>
      </div>
      <div className={'step-item-content'}>{props.content}</div>
    </div>
  );
};

const Steps = (props: StepsProps) => {
  return (
    <div className={'home-step'}>
      <Title title={props.title} />
      <div
        className={'home-step-items'}
        style={{ gridTemplateColumns: `repeat(${props.data ? props.data.length : 1}, 1fr)` }}
      >
        {props.data && props.data.map((item) => <StepsItem {...item} />)}
      </div>
    </div>
  );
};

export default Steps;
