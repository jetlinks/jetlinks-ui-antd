import './index.less';
import Title from '@/pages/home/components/Title';
import React from 'react';

interface StepItemProps {
  title: string | React.ReactNode;
  content: string | React.ReactNode;
  onClick: () => void;
  url?: string;
  after?: any
}

interface StepsProps {
  title: string | React.ReactNode;
  data: StepItemProps[];
  style?: any
}

const ItemDefaultImg = require('/public/images/home/bottom-1.png');
const StepsItem = (props: StepItemProps) => {
  return (
    <div className={props.after ? 'step-item step-bar ' : 'step-item step-bar arrow-1'}>
      <div className={'step-item-title'} onClick={props.onClick}>
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
        style={{
          gridTemplateColumns: `repeat(${props.data ? props.data.length : 1}, 1fr)`,
          minHeight: props.style?.height,
          gridColumnGap:props?.style?.gridColumnGap
        }}
      >
        {props.data && props.data.map((item) => <StepsItem {...item} after={props.style ? true : false} />)}
      </div>
    </div>
  );
};

export default Steps;
