import { SyncOutlined } from '@ant-design/icons';
import { message } from 'antd';
import ProCard from '@ant-design/pro-card';
import type { EventMetadata } from '@/pages/device/Product/typings';

interface Props {
  data: Partial<EventMetadata>;
}

const Event = (props: Props) => {
  const { data } = props;
  return (
    <ProCard
      title={data.name}
      extra={<SyncOutlined onClick={() => message.success('刷新')} />}
      layout="center"
      bordered
      headerBordered
      colSpan={{ xs: 12, sm: 8, md: 6, lg: 6, xl: 6 }}
    >
      <div style={{ height: 60 }}>{`${data.name}-事件`}</div>
    </ProCard>
  );
};
export default Event;
