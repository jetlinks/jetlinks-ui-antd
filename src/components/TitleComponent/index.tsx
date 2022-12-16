import type { CSSProperties, ReactNode } from 'react';
import './index.less';

interface TitleComponentProps {
  data: ReactNode | string;
  style?: CSSProperties;
  after?: ReactNode | string;
}
const TitleComponent = (props: TitleComponentProps) => {
  return (
    <div className="title" style={props.style}>
      <div className={'title-content'}>
        {/*<div className={'title-before'}></div>*/}
        {/*<span></span>*/}
        {props.data}
      </div>
      {props.after}
    </div>
  );
};

export default TitleComponent;
