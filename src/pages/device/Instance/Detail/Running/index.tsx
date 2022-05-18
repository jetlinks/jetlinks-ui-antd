import { InstanceModel } from '@/pages/device/Instance';
import { Card, Input, Tabs } from 'antd';
import type { DeviceMetadata } from '@/pages/device/Product/typings';
import Property from '@/pages/device/Instance/Detail/Running/Property';
import Event from '@/pages/device/Instance/Detail/Running/Event';
import { useEffect, useState } from 'react';

const Running = () => {
  const metadata = JSON.parse((InstanceModel.detail?.metadata || '{}') as string) as DeviceMetadata;
  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    setList(metadata?.events || []);
  }, [InstanceModel.detail?.metadata]);

  const operations = () => (
    <Input.Search
      style={{ maxWidth: 200, marginBottom: 10 }}
      allowClear
      placeholder="请输入名称"
      onSearch={(value: string) => {
        if (value) {
          const li = list.filter((i) => {
            return i?.name.indexOf(value) !== -1;
          });
          setList(li);
        } else {
          setList(metadata?.events || []);
        }
      }}
    />
  );

  return (
    <Card>
      <Tabs
        defaultActiveKey="1"
        tabPosition="left"
        style={{ minHeight: 600 }}
        tabBarExtraContent={{ left: operations() }}
      >
        <Tabs.TabPane tab="属性" key="1">
          <Property data={metadata?.properties || []} />
        </Tabs.TabPane>
        {list?.map((item) => (
          <Tabs.TabPane tab={item.name} key={item.id}>
            <Event data={item} />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </Card>
  );
};
export default Running;
