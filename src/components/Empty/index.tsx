import './style';
import { Empty } from 'antd';
import type { EmptyProps } from 'antd';

export default (props: EmptyProps) => {
  return (
    <div className={'empty-body'}>
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'暂无数据'} {...props} />
    </div>
  );
};
