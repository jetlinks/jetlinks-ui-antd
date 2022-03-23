import { InstanceModel } from '@/pages/device/Instance';
import { Card, Tabs } from 'antd';
import type { DeviceMetadata } from '@/pages/device/Product/typings';
import Property from '@/pages/device/Instance/Detail/Running/Property';
import Event from '@/pages/device/Instance/Detail/Running/Event';

const Running = () => {
  const metadata = JSON.parse(InstanceModel.detail.metadata as string) as DeviceMetadata;

  return (
    <Card>
      <Tabs defaultActiveKey="1" tabPosition="left" style={{ height: 600 }}>
        <Tabs.TabPane tab="属性" key="1">
          <Property data={metadata?.properties || []} />
        </Tabs.TabPane>
        {metadata.events?.map((item) => (
          <Tabs.TabPane tab={item.name} key={item.id}>
            <Event data={item} />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Card>
  );
};
export default Running;
