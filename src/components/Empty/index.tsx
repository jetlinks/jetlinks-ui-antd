import './style';
import { Empty } from 'antd';
import type { EmptyProps } from 'antd';

export default (props: EmptyProps) => {
  return (
    <div className={'empty-body'}>
      <Empty {...props} />
    </div>
  );
};
