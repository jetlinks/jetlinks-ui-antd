import type { ReactNode, CSSProperties } from 'react';
import './index.less';

interface TitleComponentProps {
  data: ReactNode | string;
  style?: CSSProperties;
}
const TitleComponent = (props: TitleComponentProps) => {
  return (
    <div className="title" style={props.style}>
      <div className={'title-before'}></div>
      <span>{props.data}</span>
    </div>
  );
};

export default TitleComponent;
