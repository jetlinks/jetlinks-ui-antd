import type { ReactNode } from 'react';
import './index.less';

interface TitleComponentProps {
  data: ReactNode | string;
}
const TitleComponent = (props: TitleComponentProps) => {
  return <div className="title">{props.data}</div>;
};

export default TitleComponent;
