import { SyncOutlined } from '@ant-design/icons';
import { message } from 'antd';
import ProCard from '@ant-design/pro-card';
import type { PropertyMetadata } from '@/pages/device/Product/typings';
import { Line } from '@ant-design/charts';

interface Props {
  data: Partial<PropertyMetadata>;
}

const Property = (props: Props) => {
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
      <Line
        height={60}
        xField="key"
        yField="value"
        xAxis={false}
        yAxis={false}
        data={[
          { key: 1, value: 12 },
          { key: 2, value: 22 },
          { key: 3, value: 32 },
          { key: 4, value: 22 },
          { key: 5, value: 12 },
        ]}
      />
    </ProCard>
  );
};
export default Property;
